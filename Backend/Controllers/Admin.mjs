import Admin from "../Models/Admin.mjs";
import {
    createAccessToken,
    createRefreshToken,
} from "../Middlewares/Tokens.mjs";

export const registerAdmin = async (req, res) => {
    try {
        const { username, mail, password } = req.body;

        if (!username || !mail || !password)
            return res
                .status(400)
                .json({ message: "Fill Value For All The Fields" });

        let exist = await Admin.findOne({ username: username });
        if (exist)
            return res
                .status(400)
                .json({ message: "User With This Username Already Exist!" });
        exist = await Admin.findOne({ mail: mail });
        if (exist)
            return res.status(400).json({ message: "Mail Already Exists!" });

        // New User
        await Admin.create({
            username,
            mail,
            password,
        });
        res.status(201).json({
            message: `${username} Registered Successfully`,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { mail, password } = req.body;
        const admin = await Admin.findOne({
            mail: mail,
        });

        if (!admin) return res.status(404).json({ message: "User Not Found" });

        const checkPassword = await admin.comparePassword(password);
        if (!checkPassword)
            return res.status(400).json({ message: "Invalid Credentials!" });

        if (admin.status !== "Active" && admin.status !== "Root") {
            return res
                .status(403)
                .json({ message: "Account Pending Activation" });
        }

        const accessToken = createAccessToken(admin._id, "Admin");
        const refreshToken = createRefreshToken(admin._id, "Admin");

        return res.status(200).json({
            admin: {
                id: admin._id,
                username: admin.username,
                mail: admin.mail,
                role: admin.role,
                status: admin.status,
            },
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
