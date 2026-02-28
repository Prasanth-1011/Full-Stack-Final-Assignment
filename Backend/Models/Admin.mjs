import mongoose, { Schema } from "mongoose";

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

adminSchema.pre("save", async () => {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.comparePassword = async () => {
    return await bcrypt.compare(this.password, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
