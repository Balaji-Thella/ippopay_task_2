const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/passwords", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successful"))
  .catch((err) => console.error(err));

// Define a schema and model for storing passwords
const passwordSchema = new mongoose.Schema({
  password: { type: String },
  result: { type: String },
});

const Password = mongoose.model("Password", passwordSchema, "Password");

// Create API endpoint to save passwords
app.post("/api/savePassword", async (req, res) => {
  const { payload } = req.body;

  try {
    const data = new Password(payload);
    data
      .save()
      .then((item) => {
        res.json({ message: "This entry is registered in our database" });
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    console.error("Error saving password:", error);
    res.status(500).json({ message: "Error saving password." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
