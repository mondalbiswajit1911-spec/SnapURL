const express = require("express");
const path = require("path");
const cookiePersar = require("cookie-parser");
const { connectToMongo } = require("./connect");
const {restrictedToLoginUserOnly} = require("./meddleware/auth");


const URL = require("./models/url");

const urlRoute = require("./routes/routerUrl");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8001;

connectToMongo("mongodb://localhost:27017/short-URL").then(() =>
  console.log("mongodb connected"),
);

//  --- views section-- server side rendaring

app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookiePersar());


app.use("/", staticRoute);
app.use("/user", userRoute);


app.use("/url",restrictedToLoginUserOnly, urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
            timestamp: Date.now(),
        },
      },
    },
     { new: true }
  );
  if (!entry) {
    return res.status(404).send("Short URL not found");
  }
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`server started at :${PORT}`));
