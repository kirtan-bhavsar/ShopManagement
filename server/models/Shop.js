import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const Shop = mongoose.model("shop", shopSchema);

export default Shop;
