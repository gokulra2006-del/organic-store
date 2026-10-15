const Product = require('../models/Product');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const mongoose = require('mongoose');

// Normalizes mongoose product documents to match frontend mock structures
const normalizeProduct = (p) => {
  if (!p) return null;
  const doc = p.toObject ? p.toObject() : p;
  
  let image = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop';
  if (doc.images && doc.images.length > 0) {
    const img = doc.images[0];
    if (img.filename) {
      image = img.filename.startsWith('http') ? img.filename : `http://localhost:5000/uploads/${img.filename}`;
    }
  } else if (doc.image) {
    image = doc.image;
  }

  return {
    id: doc._id || doc.id,
    _id: doc._id || doc.id,
    name: doc.name,
    category: doc.category?.slug || doc.category?.name || doc.category || '',
    price: doc.price,
    originalPrice: doc.comparePrice || doc.originalPrice || null,
    rating: doc.ratings?.average || doc.rating || 4.5,
    reviews: doc.ratings?.count || doc.reviews || 0,
    image,
    description: doc.description,
    inStock: doc.stock > 0,
    stock: doc.stock,
    weight: doc.weight || '1 unit',
    tags: doc.tags || [],
    unit: doc.unit || 'piece',
    isFeatured: doc.isFeatured || false,
    isActive: doc.isActive !== false,
  };
};

const defaultProducts = require('../data/defaultProducts');

exports.getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category, search, minPrice, maxPrice, sort = '-createdAt', isFeatured } = req.query;

  // Fallback to local default products if MongoDB is offline
  if (mongoose.connection.readyState !== 1) {
    let filtered = [...defaultProducts];

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (isFeatured === 'true') {
      filtered = filtered.filter(p => p.isFeatured);
    }

    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + parseInt(limit));

    return res.json(new ApiResponse(200, {
      products: paginated,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    }, 'Products fetched (mock fallback)'));
  }

  const filter = { isActive: true };

  // Category matching
  if (category && category !== 'all') {
    if (mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    } else {
      // Find category by slug or name
      const catDoc = await Category.findOne({
        $or: [
          { slug: category.toLowerCase() },
          { name: new RegExp(category, 'i') }
        ]
      });
      if (catDoc) {
        filter.category = catDoc._id;
      } else {
        // No category found, force return empty
        return res.json(new ApiResponse(200, { products: [], total: 0, page: parseInt(page), pages: 0 }, 'Products fetched'));
      }
    }
  }

  // Text search
  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { tags: new RegExp(search, 'i') }
    ];
  }

  // Price bounds
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  if (isFeatured === 'true') {
    filter.isFeatured = true;
  }

  // Sorting
  let sortOption = '-createdAt';
  if (sort === 'price-low') sortOption = 'price';
  else if (sort === 'price-high') sortOption = '-price';
  else if (sort === 'rating') sortOption = '-ratings.average';

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort(sortOption);

  const total = await Product.countDocuments(filter);
  const normalized = products.map(normalizeProduct);

  res.json(new ApiResponse(200, {
    products: normalized,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  }, 'Products fetched'));
});

exports.getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState !== 1) {
    const p = defaultProducts.find(item => String(item.id) === String(id) || String(item._id) === String(id) || item.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase());
    if (!p) throw new ApiError(404, 'Product not found');
    return res.json(new ApiResponse(200, p, 'Product fetched'));
  }

  let product;

  if (mongoose.Types.ObjectId.isValid(id)) {
    product = await Product.findById(id).populate('category', 'name slug');
  } else {
    // Treat as name slug or SKU
    const slugQuery = id.replace(/-/g, ' ');
    product = await Product.findOne({
      $or: [
        { sku: id },
        { name: new RegExp('^' + slugQuery + '$', 'i') },
        { name: new RegExp(slugQuery, 'i') }
      ]
    }).populate('category', 'name slug');
  }

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.json(new ApiResponse(200, normalizeProduct(product), 'Product fetched'));
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  const populated = await Product.findById(product._id).populate('category', 'name slug');
  res.status(201).json(new ApiResponse(201, normalizeProduct(populated), 'Product created'));
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('category', 'name slug');
  if (!product) throw new ApiError(404, 'Product not found');
  res.json(new ApiResponse(200, normalizeProduct(product), 'Product updated'));
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!product) throw new ApiError(404, 'Product not found');
  res.json(new ApiResponse(200, null, 'Product deleted'));
});

exports.getFeatured = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const featured = defaultProducts.filter(p => p.isFeatured).slice(0, 8);
    return res.json(new ApiResponse(200, featured, 'Featured products fetched (mock fallback)'));
  }
  const products = await Product.find({ isFeatured: true, isActive: true }).populate('category', 'name slug').limit(8);
  res.json(new ApiResponse(200, products.map(normalizeProduct), 'Featured products fetched'));
});