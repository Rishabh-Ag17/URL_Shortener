const URL = require('../models/url');
const shortid = require("shortid");

async function handleGenerateNewShortURL(req,res){
    const body = req.body;
    if(!body.url)return res.status(400).json({error:"Url is required!"});
    const shortID = shortid();
    await URL.create({
        shortID: shortID,
        redirectURL: body.url,
        visitedHistory: [],
        createdBy: req.user._id,
    });
    return res.render("home", {id: shortID}); 
    return res.json({id: shortID});
}

async function handleGetAnalytics(req,res){
    const shortID = req.params.shortID;
    const result = await URL.findOne({shortID});
    return res.json({ totalClicks: result.visitHistory.length, analytics: result.visitHistory});
}
module.exports = {handleGenerateNewShortURL,handleGetAnalytics};