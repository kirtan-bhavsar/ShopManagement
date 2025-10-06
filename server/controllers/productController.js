import Product from "../models/Product.js";
import Shop from "../models/Shop.js";
import User from "../models/User.js";

// Create Product
const createProduct = async (req, res) => {
  const userId = req.user.id;
  const { name, price, quantity } = req.body;
  const shopId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "User not authorized" });
  }

  if (!name) {
    return res.status(400).json({ message: "Product name is required" });
  }

  if (!shopId) {
    return res.status(400).json({ message: "Shop id is required" });
  }

  try {
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (shop.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You cannot add products to this shop" });
    }

    const product = await Product.create({
      name,
      price,
      quantity,
      shop: shopId,
      user: userId,
    });

    res
      .status(201)
      .json({ message: "Product created successfully", data: product });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error while creating product" });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "User not authorized" });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const shop = await Shop.findById(product.shop);

    if (!shop || shop.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You cannot update this product" });
    }

    const { name, price, quantity } = req.body;

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;

    await product.save();

    res
      .status(200)
      .json({ message: "Product updated successfully", data: product });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error while updating product" });
  }
};

export { createProduct, updateProduct };
