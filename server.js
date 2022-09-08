require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const jwt  = require("jsonwebtoken");

const authRoute = require("./routes/auth_route");
const restaurantRoute = require("./routes/restaurant_route");
const orderRotue = require("./routes/order_route");

mongoose
    .connect(process.env.DB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use("/auth", authRoute);
app.use(authenticateRequest);
app.use("/restaurants", restaurantRoute);
app.use("/orders", orderRotue);

app.listen(process.env.PORT || 8000);

function authenticateRequest(req, res, next) {
    const authHeaderInfo = req.headers["authorization"];
    if (authHeaderInfo === undefined) {
        return res.status(400).send({ message: "No token provided." });
    } 

    const token = authHeaderInfo.split(" ")[1];
    if (token === undefined) {
        return res.status(400).send({ message: "No proper token provided." });
    }

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userInfo = payload;
        next();
    } catch(err) {
        console.log(err)
        return res.status(403).send(err);
    }
}

// Auth
// POST /auth/signup
// POST /auth/login
// POST /auth/token

// Restaurants
// POST /restaurants: Creates new restaurant
// GET /restaurants: List all restaurants
// POST /restaurants/:id: Details of restaurants with all dishes offered
// POST /restuarants/:id/add-dish: Add new dish for a restaurant
// GET /restaurants/:id/orders: Get all orders of a restaurant, should be able to filter by passing ?status=pending etc.
// GET /restaurants/:id/revenue?start_date=2022-09-08: Get revenue of a restaurant for given time range. end_date default would be today's date

// Orders
// POST /orders: Create new order
// GET /orders/:id: Get details of any order
// POST /orders/:id/update: Change status of any order


// Payload
// {
//   id: '6319959585b57d3655234b9e',
//   name: 'John Smith',
//   email: 'john.smith@gmail.com',
//   restaurants: [],
//   iat: 1662623793,
//   exp: 1662623813
// }