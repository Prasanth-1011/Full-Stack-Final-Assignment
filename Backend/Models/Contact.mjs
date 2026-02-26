import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },

        mail: {
            type: String,
            required: true,
            unique: true,
        },

        message: {
            type: String,
            required: true,
            min: 3,
            max: 100,
        },
    },

    { timestamps: true },
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
