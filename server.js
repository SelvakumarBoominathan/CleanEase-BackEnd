import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/connection.js";
import router from "./router/route.js";

//creating server
const app = express();

//middleware
app.use(express.json());
app.use(cors());

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
      app.listen(port, () => {
        console.log("server listening to the port : ", port);
      });
    } catch (error) {
      console.log("Cannot connect to the server");
    }
  })
  .catch((error) => {
    console.log("Invalid database connection!");
  });
