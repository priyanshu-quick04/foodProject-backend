const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const mongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database Successfully");
    const fetched_data = await mongoose.connection.db
      .collection("food_items")
      .find({})
      .toArray();
    global.food_items = fetched_data;
    const foodCategory = await mongoose.connection.db
      .collection("foodCategory")
      .find({})
      .toArray();
    global.foodCategory = foodCategory;
    // console.log(global.food_items);
  } catch (error) {
    console.log(`Error while connecting to the database, ${error.message}`);
  }
};

module.exports = mongoDB;
