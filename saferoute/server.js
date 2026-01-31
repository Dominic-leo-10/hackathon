const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express(); // MUST BE FIRST

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://10.144.1.138:3000",
  ],
}));
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/saferoute")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(console.error);

const shelterRoutes = require("./routes/shelter.routes");
const hospitalRoutes = require("./routes/hospital.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

app.use("/api", shelterRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("SafeRoute Backend Running");
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
