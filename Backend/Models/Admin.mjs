import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new Schema(
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

        role: {
            type: String,
            default: "Admin",
        },

        status: {
            type: String,
            required: true,
            enum: ["Root", "Active", "Pending"],
            default: "Pending",
        },
    },
    { timestamps: true },
);

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

adminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
