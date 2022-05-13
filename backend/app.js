import express from "express";
const server = express();

import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import path from "path";

import errorMiddleware from "./middlewares/errors.js";

// Setting up config file
// if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })
dotenv.config({ path: "backend/config/.env" });

server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(fileUpload());

// Import all routes
import products from "./routes/product.js";
import auth from "./routes/auth.js";
import payment from "./routes/payment.js";
import order from "./routes/order.js";

server.use("/", products);
server.use("/", auth);
server.use("/", payment);
server.use("/", order);

if (process.env.NODE_ENV === "PRODUCTION") {
  server.use(express.static(path.join(__dirname, "../frontend/build")));

  server.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

// Middleware to handle errors
server.use(errorMiddleware);
export default server;
