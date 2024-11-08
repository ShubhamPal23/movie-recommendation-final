const express = require("express")
const mongoose = require('mongoose')
const cors = require('cors')
const EmployeeModel = require('./models/Employee')

const app = express()
app.use(express.json())
// app.use(cors())
app.use(cors(
    {
        origin: ["https://movie-recommendation-theta-hazel.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
    }
));

mongoose.connect("mongodb+srv://ripper2323:ripper%2623bham@cluster1.ipj8t.mongodb.net/employee", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.get("/", (req, res) => {
    res.json("Welcome to movie-recommendation");
})

app.post('/login', (req, res) => {
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


app.post('/register', (req, res) => {
    EmployeeModel.create(req.body)
        .then(employees => res.json(employees))
        .catch(err => res.json(err))
})



app.listen(3001, () => {
    console.log("server is running")
})
