import express from "express";
import {
  addShop,
  editShop,
  getAllShopsWithProducts,
} from "../controllers/shopController.js";
import auth from "../middleware/auth.js";

const shopRouter = express.Router();

shopRouter.post("/add", auth, addShop);
shopRouter.put("/edit/:id", auth, editShop);
shopRouter.get("/all", auth, getAllShopsWithProducts);

export default shopRouter;
