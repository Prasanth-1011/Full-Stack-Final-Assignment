import bcrypt from "bcrypt";

import User from "../Models/User.mjs";
import Admin from "../Models/Admin.mjs";
import Profile from "../Models/Profile.mjs";
import cloudinary from "../Configs/Cloudinary.mjs";

// Create Profile
export const createProfile = async (req, res) => {
    try {
        const { userId, phone, address, location } = req.body;

        if (!userId || !phone || !address || !location) {
            return res.status(400).json({ message: "All Fields Are Required" });
        }

        // Get Name And Mail
        let account =
            (await User.findById(userId)) || (await Admin.findById(userId));
        if (!account) {
            return res.status(404).json({ message: "Account Not Found" });
        }

        const profile = new Profile({
            userId,
            name: account.username,
            mail: account.mail,
            phone,
            address,
            location,
        });

        await profile.save();
        res.status(201).json({
            profile,
            message: "Profile Created Successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Profile
export const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID Required" });
        }

        const profile = await Profile.findOne({ userId });

        if (!profile) {
            return res.status(200).json(null);
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Profile Info
export const updateProfile = async (req, res) => {
    try {
        const { userId, ...data } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User Details Required" });
        }

        let imageData = {};
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "profiles" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    },
                );
                stream.end(req.file.buffer);
            });
            imageData.image = result.secure_url;
        }

        const updatedProfile = await Profile.findOneAndUpdate(
            { userId },
            { $set: { ...data, ...imageData } },
            { new: true, runValidators: true },
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile Not Found" });
        }

        res.status(200).json({
            profile: updatedProfile,
            message: "Profile Updated Successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Profile
export const deleteProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const profile = await Profile.findOneAndDelete({ userId });

        if (!profile) {
            return res.status(404).json({ message: "Profile Not Found" });
        }

        res.status(200).json({ message: "Profile Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User Account
export const updateUser = async (req, res) => {
    try {
        const { id, username, mail, password } = req.body;
        const updateData = {};

        if (username) updateData.username = username;
        if (mail) updateData.mail = mail;
        if (password) updateData.password = await bcrypt.hash(password, 10);

        const user = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true },
        );
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Admin Account
export const updateAdmin = async (req, res) => {
    try {
        const { id, username, mail, password } = req.body;
        const updateData = {};

        if (username) updateData.username = username;
        if (mail) updateData.mail = mail;
        if (password) updateData.password = await bcrypt.hash(password, 10);

        const admin = await Admin.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true },
        );
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        res.status(200).json({ message: "Admin updated successfully", admin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Profile Image
export const updateProfileImage = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Profile Image Required" });
        }

        if (!userId) {
            return res.status(400).json({ message: "User ID Required" });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "profiles" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                },
            );
            stream.end(req.file.buffer);
        });

        const updatedProfile = await Profile.findOneAndUpdate(
            { userId },
            { $set: { image: result.secure_url } },
            { new: true },
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile Not Found" });
        }

        res.status(200).json({
            profile: updatedProfile,
            message: "Profile Image Updated Successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
