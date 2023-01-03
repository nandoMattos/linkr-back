import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app
.use(express.json())
.use(cors());











const port = 3000;

app.listen(port, () => console.log(`Server running in port ${port}`));
