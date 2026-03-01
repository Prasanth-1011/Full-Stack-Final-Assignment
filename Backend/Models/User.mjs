import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            min: 3,
            max: 20,
        },

        mail: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
            min: 6,
            max: 20,
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
    },
    { timestamps: true },
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
