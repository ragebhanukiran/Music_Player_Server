const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const playlistRoutes = require("./routes/playlist");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = 8000;
const User = require("./models/User");

app.use(cors());
app.use(express.json());

// connect mongodb to our node app.
mongoose
 .connect(
 "mongodb+srv://ragebhanukiran:Rsk25802588@cluster0.64vtaen.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
 .then(() => {
    console.log("Connected to Mongo!");

    // setup passport-jwt
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = "thisKeyIsSupposedToBeSecret";
    passport.use(
      new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
          const user = await User.findOne({ _id: jwt_payload.identifier });
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (err) {
          return done(err, false);
        }
      })
    );
  })
 .catch((err) => {
    console.error("Error while connecting to Mongo:", err);
  });

// API : GET type : / : return text "Hello world"
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);

// Now we want to tell express that our server will run on localhost:8000
app.listen(port, () => {
  console.log("App is running on port " + port);
});