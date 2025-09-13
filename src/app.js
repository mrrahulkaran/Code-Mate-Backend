const express = require("express");
require("dotenv").config();

const connectDB = require("./config/database");
const app = express();

const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());

const authRouter = require("./routes/authrouter.js");
const profileRouter = require("./routes/profilerouter.js");
const requestRouter = require("./routes/requestrouter.js");
const feedRouter = require("./routes/feedrouter.js");
const userRouter = require("./routes/userrouter.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", feedRouter);
app.use("/", userRouter);

// Verify that MONGODB_URI is loaded
console.log("MongoDB URI:", process.env.MONGODB_URI);

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1); // Exit on DB failure to prevent app from running without DB
  });
