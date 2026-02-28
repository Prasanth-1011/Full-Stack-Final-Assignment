import User from "../Models/User.mjs";

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
        const user = await User.create({
            username,
            mail,
            password,
        });
        res.status(201).json({
            user: { id: user._id, username: user.username, mail: user.mail },
            message: `${username} Registered Successfully`,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { mail, password } = req.body;
        const user = await User.findOne({
            mail: mail,
        });

        if (!user) return res.status(404).json({ message: "User Not Found" });

        const checkPassword = await user.comparePassword(password);
        if (!checkPassword)
            return res.status(400).json({ message: "Invalid Credential!" });

        return res.status(200).json({
            user: { id: user._id, username: user.username, mail: user.mail },
            message: "Login Successful!",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
