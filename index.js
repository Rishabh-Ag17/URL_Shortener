const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const {connectToMongoDB} = require('./connection'); 
const {checkForAuthentication, restrictTo} = require("./middlewares/auth")

const app = express();
const PORT = 8001;
const URL = require('./models/url');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');

connectToMongoDB("mongodb://localhost:27017/short-url")
.then(()=>console.log('MongoDB connected'));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/url",restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

app.get('/url/:shortID', async (req, res) => {
    const shortID = req.params.shortID;

    try {
        const entry = await URL.findOneAndUpdate(
            { shortID },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
            { new: true } // Ensure the updated document is returned
        );

        if (!entry) {
            return res.status(404).send("Short URL not found");
        }

        return res.redirect(entry.redirectURL);
    } catch (error) {
        console.error("Error in /url/:shortID:", error);
        return res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));
