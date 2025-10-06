import express from "express";
import {
  createProduct,
  updateProduct,
} from "../controllers/productController.js";
import auth from "../middleware/auth.js";

const productRouter = express.Router();

productRouter.post("/add/:id", auth, createProduct);
productRouter.put("/edit/:id", auth, updateProduct);

export default productRouter;
