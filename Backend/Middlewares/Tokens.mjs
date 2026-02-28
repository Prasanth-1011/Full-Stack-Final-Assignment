import crypto from "crypto";
import jwt from "jsonwebtoken";

export const createSecretToken = (length = 32) =>
    crypto.randomBytes(length).toString("hex");

const secretToken = createSecretToken();
const refreshToken = createSecretToken();

export const createAccessToken = (user) => {
    return jwt.sign({ user }, secretToken, { expiresIn: "15m" });
};

export const createRefreshToken = (user) => {
    return jwt.sign({ user }, refreshToken, { expiresIn: "7d" });
};

export const verifyToken = (token) => {
    return jwt.verify(token, secretToken);
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, refreshToken);
};
