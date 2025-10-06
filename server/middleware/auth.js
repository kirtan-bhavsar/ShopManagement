import config from "dotenv/config";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  let token;

  token = req.cookies?.jwtToken;

  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token && req.headers["x-auth-token"]) {
    token = req.headers["x-auth-token"];
  }

  if (!token) {
    res.status(400).json({ message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

export default auth;
