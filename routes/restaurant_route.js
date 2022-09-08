const express = require("express");
const DishModel = require("../models/dish");
const OrderModel = require("../models/order");
const RestaurantModel = require("../models/restaurant");
const UserModel = require("../models/user");

const router = express.Router();

router.post("/", async (req, res) => {
    const { name } = req.body;
    const { id } = req.userInfo;
    if (!name) {
        return res.status(400).send({ message: "Restaurant name required." });
    }

    const existingName = await RestaurantModel.findOne({ name: name });
    if (existingName !== null) {
        return res
            .status(400)
            .send({ message: "Restaurant name already exists." });
    }

    const newRestaurant = new RestaurantModel({
        name,
        owner: id,
    });

    try {
        const savedRestaurant = await newRestaurant.save();
        await UserModel.updateOne(
            { _id: id },
            { $push: { restaurants: savedRestaurant.id } }
        );
        return res.status(201).send({
            message: "Restaurant created with id: " + savedRestaurant.id,
        });
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.get("/", async (req, res) => {
    const list = await RestaurantModel.find(
        {},
        { name: 1, owner: 1, dishes: 1 }
    )
        .populate("owner", "name email")
        .populate("dishes", "name cost");
    return res.status(200).json(list);
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const userId = req.userInfo.id;
    const findRestaurant = await RestaurantModel.findById(id);
    if (findRestaurant === null) {
        return res.status(404).send({ message: "Restaurant does not exist." });
    }
    if (userId === findRestaurant.owner) {
        await RestaurantModel.findByIdAndDelete(id);
        await UserModel.updateOne(
            { _id: userId },
            { $pull: { restaurants: id } }
        );
        return res.status(200).send({ message: "Successfully deleted." });
    } else {
        return res.status(400).send({ message: "Unauthorized operation." });
    }
});

router.post("/:id/add-dish", async (req, res) => {
    const { name, cost } = req.body;
    const { id } = req.params;
    if (!name || !cost) {
        return res.status(400).send({ message: "All fields are required." });
    }

    const findRestaurant = await RestaurantModel.findById(id);
    if (findRestaurant === null) {
        return res.status(400).send({ message: "Restaurant does not exist." });
    }

    const newDish = new DishModel({
        name,
        cost,
        restaurant: id,
    });

    try {
        const savedDish = await newDish.save();
        await RestaurantModel.updateOne(
            { _id: id },
            { $push: { dishes: savedDish.id } }
        );
        return res
            .status(201)
            .send({ message: "Dish added with id: " + savedDish.id });
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const list = await RestaurantModel.findOne(
        { _id: id },
        { _id: 0, dishes: 1 }
    ).populate("dishes", "name cost");
    if (list === null) {
        return res.status(400).send({ message: "Restaurant does not exist." });
    }

    return res.status(200).json(list.dishes);
});

router.get("/:id/orders", async (req, res) => {
    const { id } = req.params;
    const userId = req.userInfo.id;
    const { status } = req.query;
    const findRestaurant = await RestaurantModel.findById(id, {
        orders: 1,
    }).populate({
        path: "orders",
        populate: [
            {
                path: "customer",
                select: "name",
            },
            {
                path: "items.dish",
                select: "name cost",
            },
        ],
    });
    if (findRestaurant === null) {
        return res.status(400).send({ message: "Restaurant does not exist." });
    }
    if (status) {
        const list = findRestaurant.orders.filter((el) => el.status === status);
        return res.status(200).json(list);
    }

    return res.status(200).json(findRestaurant.orders);
});

router.get("/:id/revenue", async (req, res) => {
    const { id } = req.params;
    const { start_date, end_date } = req.query;
    const userId = req.userInfo.id;
    let orders;
    if (!end_date) {
        console.log(new Date(start_date).toISOString());
        orders = await OrderModel.find({
            restaurant: id,
            status: "Completed",
            updatedAt: { $gte: new Date(start_date).toISOString(), $lte: new Date().toISOString(), },
        })
        .populate("items.dish", "name cost");
    } else {
        orders = await OrderModel.find({
            restaurant: id,
            status: "Completed",
            updatedAt: {
                $gte: new Date(start_date).toISOString(),
                $lte: new Date(end_date).toISOString(),
            },
        })
        .populate("items.dish", "name cost");
    }
    let total = 0;
    for (let order of orders) {
        for (let item of order.items) {
            total += item.dish.cost * item.quantity;
        }
    }
    return res.status(200).json({ total });
});

module.exports = router;
