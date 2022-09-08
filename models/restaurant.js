const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            require: true,
        },
        owner: {
            type: String,
            ref: "foodUsers", 
            require: true,
        },
        dishes: [
            {
                type: String,
                ref: "Dishes",
            },
        ],
        orders: [
            {
                type: String,
                ref: "foodOrders",
            },
        ],
    },
    { timestamps: true }
);

const RestaurantModel = mongoose.model("Restaurants", restaurantSchema);
module.exports = RestaurantModel;
