import User from "../Models/User.mjs";
import {
    createAccessToken,
    createRefreshToken,
} from "../Middlewares/Tokens.mjs";

export const registerUser = async (req, res) => {
    try {
        const { username, mail, password } = req.body;

        if (!username || !mail || !password)
            return res
                .status(400)
                .json({ message: "Fill Value For All The Fields" });

        let exist = await User.findOne({ username: username });
        if (exist)
            return res
                .status(400)
                .json({ message: "User With This Username Already Exist!" });
        exist = await User.findOne({ mail: mail });
        if (exist)
            return res.status(400).json({ message: "Mail Already Exists!" });

        // New User
        await User.create({
            username,
            mail,
            password,
        });
        res.status(201).json({
            message: `${username} Registered Successfully`,
        });
    } catch (error) {
        res.status(500).json({
            message: "Registration Failed",
            error:
                error.name === "MongooseError" ||
                error.name === "MongoNetworkError"
                    ? "Database connection issue"
                    : error.message,
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { mail, password } = req.body;
        const user = await User.findOne({
            mail: mail,
        });

        if (!user) return res.status(404).json({ message: "User Not Found" });

        if (user.status !== "Active") {
            return res.status(403).json({
                message: "Account Inactive. Contact Admin For Activation",
            });
        }

        const checkPassword = await user.comparePassword(password);
        if (!checkPassword)
            return res.status(400).json({ message: "Invalid Credential!" });

        const accessToken = createAccessToken(user._id, "User");
        const refreshToken = createRefreshToken(user._id, "User");

        return res.status(200).json({
            user: { id: user._id, username: user.username, mail: user.mail },
            accessToken,
            refreshToken,
            message: "Login Successful!",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
