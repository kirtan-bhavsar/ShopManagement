import jwt from "jsonwebtoken";
import config from "dotenv/config";

const generateToken = async (res, user) => {
  const payload = {
    user: {
      id: user.id,
    },
  };

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    secure: false,
    sameSite: "lax",
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
    (err, token) => {
      if (err) console.log(err);

      res
        .status(200)
        .cookie("jwtToken", token, cookieOptions)
        .json({ data: user, token });
    }
  );
};

export default generateToken;
