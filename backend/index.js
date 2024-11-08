const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require("./models/Employee");

const app = express();

// Middleware to handle CORS manually
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://movie-recommendation-theta-hazel.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// Handle preflight requests for all routes
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "https://movie-recommendation-theta-hazel.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
});

app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://ripper2323:ripper%2623bham@cluster1.ipj8t.mongodb.net/employee", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("MongoDB connection error:", error));

// Default route
app.get("/", (req, res) => {
    res.json("Welcome to movie-recommendation");
});

// Login route
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    EmployeeModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json({ status: "Success", user: { name: user.name, email: user.email } });
                } else {
                    res.json({ status: "Fail", message: "Incorrect Password" });
                }
            } else {
                res.json({ status: "Fail", message: "User Not Found" });
            }
        })
        .catch(err => res.json({ status: "Error", message: err.message }));
});

// Register route
app.post("/register", (req, res) => {
    EmployeeModel.create(req.body)
        .then(employees => res.json(employees))
        .catch(err => res.json(err));
});

// Server start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
