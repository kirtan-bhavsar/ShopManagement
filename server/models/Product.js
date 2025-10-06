import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shop",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const Product = mongoose.model("product", productSchema);

export default Product;
