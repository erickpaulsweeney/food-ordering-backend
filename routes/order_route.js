const express = require("express");
const DishModel = require("../models/dish");
const OrderModel = require("../models/order");
const RestaurantModel = require("../models/restaurant");

const router = express.Router();

router.post("/", async (req, res) => {
    const { customer, restaurant, items } = req.body;
    if (!customer || !restaurant || !items) {
        return res.status(400).send({ message: "All fields are required." });
    }

    const list = await RestaurantModel.findOne(
        { _id: restaurant },
        { _id: 0, dishes: 1 }
    );
    const sameRestaurant = items.every((el) => list.dishes.includes(el.dish));
    if (!sameRestaurant) {
        return res
            .status(400)
            .send({ message: "Only one restaurant allowed per transaction." });
    }

    const newOrder = new OrderModel({
        customer,
        restaurant,
        items,
    });

    try {
        const savedOrder = await newOrder.save();
        await RestaurantModel.updateOne(
            { _id: restaurant },
            { $push: { orders: savedOrder.id } }
        );
        return res.status(201).send({
            message: "Order successfully made with id: " + savedOrder.id,
        });
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const findOrder = await OrderModel.findById(id).populate(
            "items.dish",
            "name cost"
        );
        if (findOrder === null) {
            return res.status(400).send({ message: "Order does not exist." });
        }

        return res.status(200).json(findOrder);
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.userInfo.id;
    if (!status) {
        return res.status(400).send({ message: "Status text required." });
    }
    try {
        const findOrder = await OrderModel.findById(id).populate(
            "restaurant",
            "owner"
        );
        if (!findOrder) {
            return res.status(400).send({ message: "Order does not exist." });
        }

        if (userId !== findOrder.restaurant.owner) {
            return res.status(400).send({ message: "Unathorized operation." });
        }

        await OrderModel.findByIdAndUpdate(id, { status: status });
        return res
            .status(200)
            .send({ message: "Order status successfully updated." });
    } catch (err) {
        return res.status(500).send(err);
    }
});

module.exports = router;
