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

// Get All Pending Admins (Root Only)
export const getPendingAdmins = async (req, res) => {
    try {
        const rootAdmin = await Admin.findById(req.body.rootId);

        if (!rootAdmin || rootAdmin.status !== "Root") {
            return res
                .status(403)
                .json({ message: "Access Denied: Root Admin Only" });
        }

        const pendingAdmins = await Admin.find({ status: "Pending" }).select(
            "-password",
        );
        res.status(200).json({
            pendingAdmins,
            message: "Fetched pending admins",
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Approve Admin Form Pending to Active (Root Only)
export const approveAdmin = async (req, res) => {
    try {
        const { rootId, adminIdToApprove } = req.body;

        const rootAdmin = await Admin.findById(rootId);
        if (!rootAdmin || rootAdmin.status !== "Root") {
            return res
                .status(403)
                .json({ message: "Access Denied: Root Admin Only" });
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminIdToApprove,
            { status: "Active" },
            { new: true },
        ).select("-password");

        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({
            admin: updatedAdmin,
            message: "Admin approved successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Reject Admin Form Pending to Inactive (Root Only)
export const rejectAdmin = async (req, res) => {
    try {
        const { rootId, adminIdToReject } = req.body;

        const rootAdmin = await Admin.findById(rootId);
        if (!rootAdmin || rootAdmin.status !== "Root") {
            return res
                .status(403)
                .json({ message: "Access Denied: Root Admin Only" });
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminIdToReject,
            { status: "Inactive" },
            { new: true },
        ).select("-password");

        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({
            admin: updatedAdmin,
            message: "Admin rejected successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
