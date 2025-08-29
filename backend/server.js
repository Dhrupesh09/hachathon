import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/farmDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

// Schemas
const FarmerSchema = new mongoose.Schema({
  farmName: String,
  ownerName: String,
  address: String,
  email: { type: String, unique: true },
  phone: String,
  password: String
});

const ProductSchema = new mongoose.Schema({
  farmerId: mongoose.Schema.Types.ObjectId,
  name: String,
  category: String,
  price: Number,
  unit: String,
  quantity: Number
});

const OrderSchema = new mongoose.Schema({
  farmerId: mongoose.Schema.Types.ObjectId,
  customerName: String,
  customerPhone: String,
  items: [String],
  price: Number,
  status: { type: String, default: "new" }
});

const Farmer = mongoose.model("Farmer", FarmerSchema);
const Product = mongoose.model("Product", ProductSchema);
const Order = mongoose.model("Order", OrderSchema);

// Routes
app.post("/signup", async (req, res) => {
  try {
    const farmer = new Farmer(req.body);
    await farmer.save();
    res.json({ message: "Farmer registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const farmer = await Farmer.findOne({ email, password });
  if (!farmer) return res.status(401).json({ error: "Invalid login" });
  res.json({ message: "Login successful", farmerId: farmer._id });
});

app.post("/product", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json({ message: "Product added", product });
});

app.get("/orders/:farmerId", async (req, res) => {
  const orders = await Order.find({ farmerId: req.params.farmerId });
  res.json(orders);
});

app.put("/order/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(order);
});

// Start Server
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
