import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretToken = process.env.ACCESS_TOKEN_SECRET;
const refreshToken = process.env.REFRESH_TOKEN_SECRET;

export const createAccessToken = (id, role) => {
    return jwt.sign({ id, role }, secretToken, { expiresIn: "15m" });
};

export const createRefreshToken = (id, role) => {
    return jwt.sign({ id, role }, refreshToken, { expiresIn: "7d" });
};

export const verifyToken = (token) => {
    return jwt.verify(token, secretToken);
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, refreshToken);
};
