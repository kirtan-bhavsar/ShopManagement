import express from "express";
import dotenv from "dotenv/config";
import connectDB from "./db.js";
import userRouter from "./routes/userRoutes.js";
import shopRouter from "./routes/shopRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// Ready for final push

const app = express();

const port = process.env.PORT;

connectDB();

app.use(express.json());

app.use(cookieParser());


// Enable CORS for frontend
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // allow cookies to be sent
  })
);

// Mounting Routers
app.use("/api/v1/user", userRouter);
app.use("/api/v1/shop", shopRouter);
app.use("/api/v1/product", productRouter);

app.get("/", (req, res) => {
  res.json({
    message: "API Running successfully...",
  });
});

app.listen(port, () => {
  console.log(`Server Running successfully on port ${port}`);
});
