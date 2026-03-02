import jwt from "jsonwebtoken";

export const createAccessToken = (id, role) => {
    const secretToken = process.env.ACCESS_TOKEN_SECRET;
    return jwt.sign({ id, role }, secretToken, { expiresIn: "15m" });
};

export const createRefreshToken = (id, role) => {
    const refreshToken = process.env.REFRESH_TOKEN_SECRET;
    return jwt.sign({ id, role }, refreshToken, { expiresIn: "7d" });
};

export const verifyToken = (token) => {
    const secretToken = process.env.ACCESS_TOKEN_SECRET;
    return jwt.verify(token, secretToken);
};

export const verifyRefreshToken = (token) => {
    const refreshToken = process.env.REFRESH_TOKEN_SECRET;
    return jwt.verify(token, refreshToken);
};
