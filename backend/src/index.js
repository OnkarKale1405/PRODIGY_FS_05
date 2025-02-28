import dotenv from "dotenv";
import connectToDatabase from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectToDatabase()
  .then(() => {
    app.on("error", (err) => {
      console.error("Error in connecting MONGODB: ", err);
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Sever is running at PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection Failure: ", err);
  });
