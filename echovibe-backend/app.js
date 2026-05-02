require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const songRoutes = require("./routes/songRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req,res,next)=>{
 console.log(req.method, req.url);
 next();
});

app.use("/api/auth", authRoutes);
app.use("/api", songRoutes);

app.get("/", (req, res) => {
  res.send("EchoVibe API Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});     