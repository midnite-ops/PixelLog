import express from "express";
import route from "./routes/logRoutes";
import connectDb from "./config/db";
import dotenv from 'dotenv'

dotenv.config()

const app = express();

app.use(express.json());

app.use("/pixelLog", route);

connectDb().then(() =>
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  }),
);
