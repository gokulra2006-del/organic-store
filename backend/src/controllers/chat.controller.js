// src/controllers/chat.controller.js

const openRouterService = require('../services/ai/OpenRouterService');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Address = require('../models/Address');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

class ChatController {
    /**
     * Main chat endpoint
     */
    chat = asyncHandler(async (req, res) => {
        const { message } = req.body;
        const userId = req.user?._id?.toString() || `guest_${req.ip}`;

        if (!message?.trim()) {
            throw new ApiError(400, 'Message is required');
        }

        // Build rich context from database
        const context = await this.buildContext(req.user);

        // Get AI response with fallback
        const aiResult = await openRouterService.chat(userId, message, context);

        // Execute any tool calls
        let finalResponse = aiResult.response;
        let actions = [];

        try {
            const parsed = JSON.parse(aiResult.response);
            if (parsed.type === 'tool_calls') {
                const toolResults = await this.executeTools(parsed.calls, req.user, context);
                actions = toolResults;
                
                // Generate friendly response from tool results
                finalResponse = this.formatToolResponse(toolResults, message);
            }
        } catch (e) {
            // Not JSON, use as-is
        }

        res.json(new ApiResponse(200, {
            message: finalResponse,
            model: aiResult.model,
            fallbackUsed: aiResult.fallbackUsed,
            actions,
            context: {
                cartItems: context.cart?.items?.length || 0,
                activeOrders: context.activeOrders?.length || 0
            }
        }, 'Chat response'));
    });

    /**
     * Build rich context for AI
     */
    async buildContext(user) {
        const context = { user: null, cart: null, activeOrders: [], addresses: [] };

        if (!user) return context;

        context.user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        };

        // Cart
        const cart = await Cart.findOne({ user: user._id })
            .populate('items.product', 'name price images stock unit');
        
        if (cart?.items?.length > 0) {
            context.cart = {
                items: cart.items.map(item => ({
                    name: item.product?.name,
                    quantity: item.quantity,
                    unit: item.unit || item.product?.stock?.unit,
                    price: item.product?.price?.salePrice || item.product?.price?.mrp,
                    image: item.product?.images?.[0] ? 'has_image' : null
                })),
                total: cart.items.reduce((sum, item) => {
                    const price = item.product?.price?.salePrice || item.product?.price?.mrp;
                    return sum + (price * item.quantity);
                }, 0),
                itemCount: cart.items.length
            };
        }

        // Active orders
        const activeOrders = await Order.find({
            user: user._id,
            status: { $nin: ['delivered', 'cancelled', 'returned'] }
        })
        .select('orderNumber status pricing.total estimatedDelivery')
        .sort('-createdAt')
        .limit(3);
        
        context.activeOrders = activeOrders;

        // Addresses
        const addresses = await Address.find({ user: user._id })
            .select('fullName city state pincode isDefault');
        context.addresses = addresses;

        // Popular products for recommendations
        const popular = await Product.find({ isActive: true, isFeatured: true })
            .select('name price stock slug')
            .limit(5);
        context.popularProducts = popular;

        return context;
    }

    /**
     * Execute AI tool calls against database
     */
    async executeTools(calls, user, context) {
        const results = [];

        for (const call of calls) {
            const { tool, params } = call;
            let result;

            try {
                switch (tool) {
                    case 'search_products':
                        result = await this.toolSearchProducts(params);
                        break;
                    
                    case 'add_to_cart':
                        result = await this.toolAddToCart(params, user);
                        break;
                    
                    case 'view_cart':
                        result = { type: 'cart', data: context.cart };
                        break;
                    
                    case 'place_order':
                        result = await this.toolPlaceOrder(params, user, context);
                        break;
                    
                    case 'track_order':
                        result = await this.toolTrackOrder(params, user);
                        break;
                    
                    case 'get_product_info':
                        result = await this.toolProductInfo(params);
                        break;
                    
                    default:
                        result = { error: `Unknown tool: ${tool}` };
                }
            } catch (error) {
                result = { error: error.message };
            }

            results.push({ tool, params, result });
        }

        return results;
    }

    /**
     * TOOL: Search products
     */
    async toolSearchProducts(params) {
        const { query, category, max_price, organic_only } = params;
        
        const searchQuery = {
            isActive: true,
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } },
                { description: { $regex: query, $options: 'i' } }
            ]
        };

        if (category && category !== 'all') {
            // You'd need to map category name to ID
            searchQuery.subCategory = category;
        }

        if (max_price) {
            searchQuery['price.mrp'] = { $lte: max_price };
        }

        if (organic_only) {
            searchQuery.isOrganic = true;
        }

        const products = await Product.find(searchQuery)
            .select('name slug price stock isOrganic origin shelfLife')
            .limit(8);

        return {
            type: 'products',
            count: products.length,
            products: products.map(p => ({
                name: p.name,
                slug: p.slug,
                price: p.price,
                stock: p.stock.quantity,
                unit: p.stock.unit,
                isOrganic: p.isOrganic,
                origin: p.origin,
                inStock: p.stock.quantity > 0
            }))
        };
    }

    /**
     * TOOL: Add to cart
     */
    async toolAddToCart(params, user) {
        if (!user) {
            return { error: 'Please login to add items to cart' };
        }

        const { items } = params;
        const added = [];
        const failed = [];

        for (const item of items) {
            const product = await Product.findOne({
                name: { $regex: item.product_name, $options: 'i' },
                isActive: true
            });

            if (!product) {
                failed.push({ name: item.product_name, reason: 'Product not found' });
                continue;
            }

            if (product.stock.quantity < item.quantity) {
                failed.push({ 
                    name: product.name, 
                    reason: `Only ${product.stock.quantity} ${product.stock.unit} available` 
                });
                continue;
            }

            // Add to cart logic (simplified — use your cart service)
            let cart = await Cart.findOne({ user: user._id });
            if (!cart) {
                cart = new Cart({ user: user._id, items: [] });
            }

            const existingItem = cart.items.find(
                i => i.product.toString() === product._id.toString()
            );

            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                cart.items.push({
                    product: product._id,
                    quantity: item.quantity,
                    unit: item.unit || product.stock.unit,
                    priceAtAdd: product.price.salePrice || product.price.mrp
                });
            }

            await cart.save();
            added.push({
                name: product.name,
                quantity: item.quantity,
                unit: item.unit || product.stock.unit,
                price: product.price.salePrice || product.price.mrp
            });
        }

        return { type: 'cart_update', added, failed };
    }

    /**
     * TOOL: Place order
     */
    async toolPlaceOrder(params, user, context) {
        if (!user) {
            return { error: 'Please login to place orders' };
        }

        if (!context.cart || context.cart.items.length === 0) {
            return { error: 'Your cart is empty. Add some products first!' };
        }

        const { payment_method, address_id, notes } = params;

        // Get default address if none specified
        let address;
        if (address_id) {
            address = await Address.findOne({ _id: address_id, user: user._id });
        } else {
            address = await Address.findOne({ user: user._id, isDefault: true });
        }

        if (!address) {
            return { error: 'No delivery address found. Please add an address first.' };
        }

        // Return order preview (actual order creation would use your order service)
        return {
            type: 'order_preview',
            items: context.cart.items,
            total: context.cart.total,
            deliveryCharge: context.cart.total > 500 ? 0 : 40,
            grandTotal: context.cart.total + (context.cart.total > 500 ? 0 : 40),
            paymentMethod: payment_method,
            address: {
                name: address.fullName,
                city: address.city,
                pincode: address.pincode
            },
            notes: notes || null,
            readyToConfirm: true
        };
    }

    /**
     * TOOL: Track order
     */
    async toolTrackOrder(params, user) {
        const { order_number } = params;
        
        const query = { orderNumber: order_number };
        if (user) query.user = user._id;

        const order = await Order.findOne(query)
            .select('orderNumber status statusHistory pricing estimatedDelivery actualDelivery')
            .populate('items.product', 'name');

        if (!order) {
            return { error: `Order ${order_number} not found` };
        }

        const latestStatus = order.statusHistory?.[order.statusHistory.length - 1];

        return {
            type: 'order_status',
            orderNumber: order.orderNumber,
            status: order.status,
            latestUpdate: latestStatus?.note || order.status,
            updatedAt: latestStatus?.timestamp || order.updatedAt,
            estimatedDelivery: order.estimatedDelivery,
            actualDelivery: order.actualDelivery,
            total: order.pricing?.total,
            items: order.items?.map(i => i.name)
        };
    }

    /**
     * TOOL: Product info
     */
    async toolProductInfo(params) {
        const { product_name } = params;
        
        const product = await Product.findOne({
            name: { $regex: product_name, $options: 'i' },
            isActive: true
        }).select('name description price stock isOrganic origin shelfLife metadata nutrients weight');

        if (!product) {
            return { error: `Product "${product_name}" not found` };
        }

        return {
            type: 'product_info',
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            isOrganic: product.isOrganic,
            origin: product.origin,
            shelfLife: product.shelfLife,
            nutrients: product.metadata?.nutrients,
            weight: product.weight
        };
    }

    /**
     * Format tool results into friendly AI-like response
     */
    formatToolResponse(toolResults, originalMessage) {
        for (const result of toolResults) {
            const { tool, result: data } = result;

            switch (tool) {
                case 'search_products': {
                    if (data.error) return data.error;
                    if (data.products.length === 0) return `😕 No products found matching your search. Try "fruits", "vegetables", or a specific item name.`;

                    const list = data.products.map(p => {
                        const price = p.price.salePrice || p.price.mrp;
                        const organic = p.isOrganic ? '🌿 ' : '';
                        const stock = p.inStock ? '✅ In Stock' : '❌ Out of Stock';
                        return `${organic}**${p.name}** — ₹${price}/${p.unit} — ${stock}`;
                    }).join('\n');

                    return `Here are the products I found:\n\n${list}\n\n💡 Say "Add [product name] to cart" to add anything!`;
                }

                case 'add_to_cart': {
                    if (data.error) return data.error;
                    
                    const added = data.added.map(a => `✅ ${a.quantity}${a.unit} ${a.name} — ₹${a.price * a.quantity}`).join('\n');
                    const failed = data.failed?.length > 0 ? `\n\n⚠️ Couldn't add:\n${data.failed.map(f => `• ${f.name}: ${f.reason}`).join('\n')}` : '';
                    
                    return `Added to your cart:\n\n${added}${failed}\n\n🛒 View cart or say "Place order" to checkout!`;
                }

                case 'cart_update': {
                    // Same as add_to_cart
                    return this.formatToolResponse([{ tool: 'add_to_cart', result: data }], originalMessage);
                }

                case 'order_preview': {
                    if (data.error) return data.error;
                    
                    const items = data.items.map(i => `• ${i.quantity}${i.unit} ${i.name}`).join('\n');
                    const delivery = data.deliveryCharge > 0 ? `Delivery: ₹${data.deliveryCharge}` : '🚚 Free Delivery';
                    
                    return `📋 **Order Preview**\n\n${items}\n\nSubtotal: ₹${data.total}\n${delivery}\n**Grand Total: ₹${data.grandTotal}**\n\n📍 Deliver to: ${data.address.name}, ${data.address.city}\n💳 Payment: ${data.paymentMethod.toUpperCase()}\n\nReply **"Confirm"** to place this order!`;
                }

                case 'order_status': {
                    if (data.error) return data.error;
                    
                    const statusEmoji = {
                        pending: '⏳',
                        confirmed: '✅',
                        processing: '🔧',
                        packed: '📦',
                        out_for_delivery: '🚚',
                        delivered: '🎉',
                        cancelled: '❌'
                    };

                    const emoji = statusEmoji[data.status] || '📦';
                    const delivery = data.estimatedDelivery 
                        ? `Expected by: ${new Date(data.estimatedDelivery).toLocaleDateString('en-IN')}`
                        : '';

                    return `${emoji} **Order ${data.orderNumber}**\n\nStatus: **${data.status.toUpperCase()}**\n${data.latestUpdate}\n\n${delivery}\n\nTotal: ₹${data.total}`;
                }

                case 'product_info': {
                    if (data.error) return data.error;
                    
                    const organic = data.isOrganic ? '🌿 **Certified Organic**\n\n' : '';
                    const nutrients = data.nutrients?.map(n => `• ${n.name}: ${n.value}${n.unit}`).join('\n') || '';
                    
                    return `**${data.name}**\n\n${organic}${data.description}\n\n💰 Price: ₹${data.price.mrp}/${data.stock.unit}\n📦 Stock: ${data.stock.quantity} ${data.stock.unit} available\n🏷️ Origin: ${data.origin || 'India'}\n⏱️ Shelf Life: ${data.shelfLife || '7 days'}\n\n${nutrients ? `🥗 Nutrition:\n${nutrients}` : ''}`;
                }
            }
        }

        return "I've processed your request. How else can I help?";
    }

    /**
     * Health check
     */
    health = asyncHandler(async (req, res) => {
        const status = openRouterService.getHealthStatus();
        res.json(new ApiResponse(200, status, 'AI service health'));
    });

    /**
     * Clear chat history
     */
    clearHistory = asyncHandler(async (req, res) => {
        const userId = req.user?._id?.toString() || `guest_${req.ip}`;
        openRouterService.clearHistory(userId);
        res.json(new ApiResponse(200, null, 'Chat history cleared'));
    });
}

module.exports = new ChatController();