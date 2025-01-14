const express = require("express");
const URL = require("../models/url");
const router = express.Router();
const {restrictTo} = require("../middlewares/auth");
router.get("/", restrictTo(["NORMAL", "ADMIN"]), async (req,res)=>{
    const allUrls = await URL.find({ createdBy: req.user._id });
    res.render("home", {
        urls: allUrls,
    });
})

router.get('/admin/urls', restrictTo(["ADMIN"]), async (req,res)=>{
    const allUrls = await URL.find({ });
    res.render("home", {
        urls: allUrls,
    });
})

router.get('/signup', (req, res) =>{
    res.render("signup");
})

router.get('/login', (req, res) =>{
    res.render("login");
})


module.exports = router;