import Admin from "../Models/Admin.mjs";

const initRootAdmin = async () => {
    try {
        const rootExists = await Admin.findOne({ status: "Root" });
        if (!rootExists) {
            const rootAdmin = new Admin({
                username: process.env.ROOT_USERNAME,
                mail: process.env.ROOT_MAIL,
                password: process.env.ROOT_PASSWORD,
                role: "Admin",
                status: "Root",
            });
            await rootAdmin.save();
        } else {
            console.log("Root Admin Already Exists.");
        }
    } catch (error) {
        console.error("Failed Initializing Root Admin:", error);
    }
};

export default initRootAdmin;
