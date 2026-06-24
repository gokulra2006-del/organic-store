// src/services/ai/OpenRouterService.js

const OpenAI = require('openai');

// Try to load config, fallback if missing
let OPENROUTER_CONFIG;
try {
    OPENROUTER_CONFIG = require('../../config/ai.config').OPENROUTER_CONFIG;
} catch (e) {
    // Fallback config if file missing
    OPENROUTER_CONFIG = {
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY,
        models: [
            { name: 'openai/gpt-4o-mini', maxTokens: 1000, temperature: 0.7 },
            { name: 'anthropic/claude-3.5-haiku', maxTokens: 1000, temperature: 0.7 },
            { name: 'google/gemini-1.5-flash', maxTokens: 1000, temperature: 0.7 }
        ],
        timeout: 15000,
        maxRetries: 2,
        headers: {
            'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
            'X-Title': 'Organic Store AI Chat'
        }
    };
}

// Simple logger fallback
const logger = {
    info: (msg, ...args) => console.log(`[INFO] ${msg}`, ...args),
    error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args),
    warn: (msg, ...args) => console.warn(`[WARN] ${msg}`, ...args)
};

class OpenRouterService {
    constructor() {
        if (!OPENROUTER_CONFIG.apiKey) {
            console.warn('⚠️ OPENROUTER_API_KEY not set. AI chat will use rule-based fallback only.');
        }

        this.client = new OpenAI({
            baseURL: OPENROUTER_CONFIG.baseURL,
            apiKey: OPENROUTER_CONFIG.apiKey,
            defaultHeaders: OPENROUTER_CONFIG.headers,
            timeout: OPENROUTER_CONFIG.timeout
        });

        this.conversations = new Map();
    }

    async chat(userId, message, context = {}) {
        const history = this.getHistory(userId);
        history.push({ role: 'user', content: message, timestamp: new Date() });

        // Try each model in fallback chain
        for (let i = 0; i < OPENROUTER_CONFIG.models.length; i++) {
            const modelConfig = OPENROUTER_CONFIG.models[i];
            
            try {
                logger.info(`Trying model: ${modelConfig.name}`);

                const response = await this.tryModel(modelConfig, history, context, message);

                history.push({ 
                    role: 'assistant', 
                    content: response,
                    model: modelConfig.name,
                    timestamp: new Date() 
                });
                
                this.trimHistory(history);
                this.conversations.set(userId, history);

                return {
                    success: true,
                    response,
                    model: modelConfig.name,
                    fallbackUsed: i > 0
                };

            } catch (error) {
                logger.error(`Model ${modelConfig.name} failed:`, error.message);
                continue;
            }
        }

        // All failed — rule-based fallback
        return this.ruleBasedFallback(message, context);
    }

    async tryModel(modelConfig, history, context, currentMessage) {
        const messages = [
            { role: 'system', content: this.buildSystemPrompt(context) },
            ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
            { role: 'user', content: this.enhanceMessage(currentMessage, context) }
        ];

        const response = await this.client.chat.completions.create({
            model: modelConfig.name,
            messages,
            temperature: modelConfig.temperature,
            max_tokens: modelConfig.maxTokens
        });

        return response.choices[0].message.content;
    }

    buildSystemPrompt(context) {
        return `You are OrganicBot — the AI shopping assistant for Organic Store, a premium online grocery platform in India.

STORE INFO:
- Name: Organic Store
- Specializes in: Organic fruits, vegetables, dairy, grains
- Delivery: 30-60 min express, 2-3 hours standard
- Free delivery above ₹500
- Payment: COD, Online (UPI/Card)
- Currency: Indian Rupees (₹)

YOUR CAPABILITIES:
1. PRODUCT SEARCH: Find products by name, category, price range
2. CART MANAGEMENT: Add items, remove items, show cart, clear cart
3. ORDER PLACEMENT: Help checkout with address & payment
4. ORDER TRACKING: Check status of existing orders
5. PRODUCT INFO: Organic certification, nutrition, shelf life
6. RECOMMENDATIONS: Suggest based on preferences, season, deals

RULES:
- Be friendly, helpful, and concise (max 3-4 sentences)
- Always show prices in ₹
- For products, format as: "🍎 Apples (Organic) — ₹120/kg — In Stock"
- If out of stock, suggest 2 alternatives
- Never make up prices — use provided context only
- For orders, always confirm: items, total, address, payment method
- Use emojis sparingly for visual appeal`;
    }

    enhanceMessage(message, context) {
        let enhanced = message;
        if (context.cart?.items?.length > 0) {
            enhanced += `\n\n[CURRENT CART: ${context.cart.items.length} items, Total: ₹${context.cart.total}]`;
        }
        if (context.user) {
            enhanced += `\n\n[USER: ${context.user.fullName}]`;
        }
        return enhanced;
    }

    ruleBasedFallback(message, context) {
        const lower = message.toLowerCase();
        
        if (lower.match(/show|find|search|looking/)) {
            return "🔍 I'd help you search, but my AI brain is resting. Try: 'Show organic apples' or check the Products page. Popular: 🍎 Apples ₹120/kg, 🍌 Bananas ₹60/kg";
        }
        if (lower.match(/cart|add|remove/)) {
            return "🛒 Cart management is available! Try: 'Add 2kg apples' or 'Show my cart'. I'm in backup mode.";
        }
        if (lower.match(/order|status|track/)) {
            return "📦 Check your orders in the Orders page, or tell me your order number (like ORG12345).";
        }
        if (lower.match(/hello|hi|hey/)) {
            return "👋 Hello! Welcome to Organic Store! I'm in backup mode. Try: 'Show fruits', 'My cart', or 'Order status'.";
        }
        return "🌿 I'm OrganicBot! I'm currently in backup mode. I can help you browse products, manage your cart, and track orders. What would you like to do?";
    }

    getHistory(userId) {
        if (!this.conversations.has(userId)) {
            this.conversations.set(userId, []);
        }
        return this.conversations.get(userId);
    }

    clearHistory(userId) {
        this.conversations.delete(userId);
    }

    trimHistory(history) {
        if (history.length > 20) {
            const recent = history.slice(-18);
            history.length = 0;
            history.push(...recent);
        }
    }

    getHealthStatus() {
        return {
            provider: 'openrouter',
            apiKeyConfigured: !!OPENROUTER_CONFIG.apiKey,
            models: OPENROUTER_CONFIG.models.map(m => m.name),
            activeConversations: this.conversations.size
        };
    }
}

module.exports = new OpenRouterService();