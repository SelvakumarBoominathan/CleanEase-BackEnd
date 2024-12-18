import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/connection.js";
import router from "./router/route.js";
import dotenv from "dotenv";
import config from "./config.js";
import bodyParser from "body-parser";
dotenv.config();

//creating server
const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // allow frontend origin requests
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow all api methods from FE origin
    credentials: true, // Enable cookies to be sent with requests
  })
);

//middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//usage of morgan library
app.use(morgan("tiny"));

//prevent hackers
app.disable("x-powered-by");

const port = 8000;

//GET request

app.get("/", (req, res) => {
  res.status(201).json("Home GET Request");
});

app.use("/api", router);

//server listener only if there is valid Mongo connection established
connect()
  .then(() => {
    try {
      app.listen(8000, "0.0.0.0", () => {
        console.log("Server is listening on port 8000");
      });
      app.listen(config.port, () => {
        console.log("server listening to the port : ", port);
      });
    } catch (error) {
      console.log("Cannot connect to the server");
    }
  })
  .catch((error) => {
    console.log("Invalid database connection!");
  });
