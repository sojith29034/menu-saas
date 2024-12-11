import asyncHandler from 'express-async-handler';
import Shop from '../models/shopModel.js';

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
const getShops = asyncHandler(async (req, res) => {
  try {
    console.log('=== Fetching All Shops ===');
    const shops = await Shop.find({});
    console.log(`Found ${shops.length} shops`);
    console.log('Shops:', JSON.stringify(shops, null, 2));
    res.json(shops);
  } catch (error) {
    console.error('❌ Error fetching shops:', error);
    throw error;
  }
});

// @desc    Get shop by slug
// @route   GET /api/shops/:slug
// @access  Public
const getShopBySlug = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({ slug: req.params.slug });
  
  if (shop) {
    res.json(shop);
  } else {
    res.status(404);
    throw new Error('Shop not found');
  }
});

// @desc    Create shop
// @route   POST /api/shops
// @access  Private
const createShop = asyncHandler(async (req, res) => {
  try {
    console.log('=== Starting Shop Creation ===');
    
    // Generate slug from name
    const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Convert menu array to proper format
    const menuData = {};
    if (Array.isArray(req.body.menu)) {
      req.body.menu.forEach(category => {
        category.items.forEach(item => {
          if (item.description === '') {
            item.description = null; // Set to null if empty
          }
        });
        menuData[category.categoryName] = category.items;
      });
    }

    const shopData = {
      user: req.user._id,
      ...req.body,
      slug,
      menu: menuData
    };

    console.log('Creating shop with data:', JSON.stringify(shopData, null, 2));

    const shop = new Shop(shopData);
    const createdShop = await shop.save();
    
    console.log('Shop created successfully:', createdShop);
    res.status(201).json(createdShop);
  } catch (error) {
    console.error('❌ Error creating shop:', error);
    throw error;
  }
});

// @desc    Update shop
// @route   PUT /api/shops/:id
// @access  Private
const updateShop = asyncHandler(async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      res.status(404);
      throw new Error('Shop not found');
    }

    // Check authorization
    if (shop.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized');
    }

    // Generate new slug if name is changed
    const slug = req.body.name ? req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : shop.slug;

    // Convert menu array to proper format
    const menuData = {};
    if (Array.isArray(req.body.menu)) {
      req.body.menu.forEach(category => {
        category.items.forEach(item => {
          if (item.description === '') {
            item.description = null; // Set to null if empty
          }
        });
        menuData[category.categoryName] = category.items;
      });
    }

    const updatedData = {
      ...req.body,
      slug,
      menu: menuData
    };

    const updatedShop = await Shop.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.json(updatedShop);
  } catch (error) {
    console.error('❌ Error updating shop:', error);
    throw error;
  }
});

// @desc    Delete shop
// @route   DELETE /api/shops/:id
// @access  Private
const deleteShop = asyncHandler(async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      res.status(404);
      throw new Error('Shop not found');
    }

    if (shop.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized');
    }

    await shop.deleteOne();
    res.json({ message: 'Shop removed' });
  } catch (error) {
    console.error('❌ Error deleting shop:', error);
    throw error;
  }
});

export {
  getShops,
  getShopBySlug,
  createShop,
  updateShop,
  deleteShop,
};