const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
    {
        customer: {
            type: String,
            ref: "foodUsers",
            require: true,
        },
        restaurant: {
            type: String,
            ref: "Restaurants",
            require: true,
        },
        items: [
            mongoose.Schema({
                dish: {
                    type: String,
                    ref: "Dishes",
                    require: true,
                },
                quantity: {
                    type: Number,
                    require: true,
                },
            }),
        ],
        status: {
            type: String,
            default: "Pending",
        },
    },
    { timestamps: true }
);

const OrderModel = mongoose.model("foodOrders", orderSchema);
module.exports = OrderModel;
