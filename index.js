const express = require("express");
const path = require("path");

const {connectMongoose} = require("./connections.js");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const URL = require("./models/url");
const { url } = require("inspector");

const app = express();
const PORT = 8000;

connectMongoose('mongodb://localhost:27017/short-url')
.then(()=>{console.log("MongoDB connected")});

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/url",urlRoute);
app.use("/",staticRoute);


app.get("/test",async (req,res)=>{
    const allUrls = await URL.find({});
    // return res.end(`
    //     <html>
    //     <head></head>
    //     <body>
    //     <ol>
    //     ${allURLs.map(url=>`<li>${url.shortId}-${url.redirectURL}-${url.visitHistory.length}</li>`).join("")}
    //     </ol>
    //     </body>
    //     </html>
        
    //     `

    // )


    return res.render("home",{
        urls :allUrls,
    });
})

app.get("/url/:shortId",async (req,res)=>{
const shortId = req.params.shortId;
const entry = await URL.findOneAndUpdate({
    shortId
},
{
    $push:{
        visitHistory:
        {
            timestamp:Date.now(),
        },
    },
}
);
res.redirect(entry.redirectURL);
});

app.listen(PORT,()=>console.log(`Server Started at PORT = ${PORT}`));