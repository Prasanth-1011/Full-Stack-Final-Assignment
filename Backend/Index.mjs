import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import connect from "./Database.mjs";

dotenv.config();

const app = express();
const port = process.env.PORT;

// Database Connection
connect();

// Middlewares
app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
