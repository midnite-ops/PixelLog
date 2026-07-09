import express from "express";
import route from './routes/logRoutes';

const app = express();

app.use(express.json())

app.use("/pixelLog", route)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});