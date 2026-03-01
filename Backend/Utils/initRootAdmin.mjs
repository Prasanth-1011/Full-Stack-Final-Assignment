import Admin from "../Models/Admin.mjs";

const initRootAdmin = async () => {
    try {
        const rootExists = await Admin.findOne({ status: "Root" });
        if (!rootExists) {
            const rootAdmin = new Admin({
                username: "Root",
                mail: "root@admin.com",
                password: "121212",
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
