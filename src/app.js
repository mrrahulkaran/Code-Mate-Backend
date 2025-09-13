const express = require("express");
require("dotenv").config();
const connenctDB = require("./config/database");
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

connenctDB()
  .then(() => {
    console.log("database connection established");
    app.listen(3000, () => {
      console.log("server is running on 3000 port");
    });
  })
  .catch((err) => {
    console.error("database connection error", err);
  });
