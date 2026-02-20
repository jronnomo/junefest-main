import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import products from './data/products.js';
import bars from './data/bars.js';
import events from './data/events.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import Bar from './models/barModel.js';
import Event from './models/eventModel.js';
import CarouselImage from './models/carouselImageModel.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Bar.deleteMany();
    await Event.deleteMany();
    await CarouselImage.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => ({ ...product, user: adminUser }));
    await Product.insertMany(sampleProducts);

    await Bar.insertMany(bars);

    const sampleEvents = events.map((event) => ({ ...event, createdBy: adminUser }));
    await Event.insertMany(sampleEvents);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Bar.deleteMany();
    await Event.deleteMany();
    await CarouselImage.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
