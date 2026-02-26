import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },

        name: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },

        phone: {
            type: Number,
            required: true,
            length: 10,
        },

        address: {
            type: String,
            required: true,
            min: 3,
            max: 100,
        },

        location: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
    },

    { timestamps: true },
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
