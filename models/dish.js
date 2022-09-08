const mongoose = require("mongoose");

const dishSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        cost: {
            type: Number,
            require: true,
        },
        restaurant: {
            type: String,
            ref: "Restaurants",
            require: true,
        },
    },
    { timestamps: true }
);

const DishModel = mongoose.model("Dishes", dishSchema);
module.exports = DishModel;
