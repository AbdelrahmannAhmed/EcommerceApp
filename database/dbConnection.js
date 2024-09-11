import Mongoose from "mongoose";

export const dbConnection = Mongoose.connect(
    "mongodb+srv://abdelrhman2516:1QAZWSXedc@cluster0.0alse.mongodb.net/EcommerceApp"
)
    .then(() => {
        console.log("database connected successfully");
    })
    .catch((err) => {
        console.log(err);
    });
