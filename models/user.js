const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
        restaurants: [
            {
                type: String,
                ref: "Restaurants",
            },
        ],
    },
    { timestamps: true }
);

const UserModel = mongoose.model("foodUsers", userSchema);
module.exports = UserModel;
