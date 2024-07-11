const express = require("express");
const router = express.Router();
const passport = require("passport");
const Song = require("../models/Song");
const User = require("../models/User");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ err: "Unauthorized" });
    }
    const { name, thumbnail, track } = req.body;
    if (!name || !thumbnail || !track) {
      return res.status(400).json({ err: "Insufficient details to create song." });
    }
    const artist = req.user._id;
    const songDetails = { name, thumbnail, track, artist };
    try {
      const createdSong = await Song.create(songDetails);
      return res.status(201).json(createdSong);
    } catch (err) {
      console.error("Error creating song:", err);
      return res.status(500).json({ err: "Error creating song" });
    }
  }
);


// Get route to get all songs any artist has published
router.get(
  "/get/artist/:artistId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { artistId } = req.params;
    try {
      const artist = await User.findOne({ _id: artistId });
      if (!artist) {
        return res.status(301).json({ err: "Artist does not exist" });
      }
      const songs = await Song.find({ artist: artistId });
      return res.status(200).json({ data: songs });
    } catch (err) {
      console.error("Error fetching artist's songs:", err);
      return res.status(500).json({ err: "Error fetching artist's songs" });
    }
  }
);

// Get route to get a single song by name
router.get(
  "/get/songname/:songName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { songName } = req.params;
    try {
      const song = await Song.find({ name: { $regex: songName, $options: 'i' } }).populate("artist");
      if (!song) {
        return res.status(404).json({ err: "Song not found" });
      }
      return res.status(200).json({ data: song });
    } catch (err) {
      console.error(`Error fetching song by name: ${err}`);
      return res.status(500).json({ err: "Error fetching song by name" });
    }
  }
);

// Get route to get all songs I have published.
router.get(
  "/get/mysongs",
  passport.authenticate("jwt", {session: false}),
  async (req, res) => {
      // We need to get all songs where artist id == currentUser._id
      const songs = await Song.find({artist: req.user._id}).populate(
          "artist"
      );
      return res.status(200).json({data: songs});
  }
);

// Delete route to delete a song
router.delete(
  "/delete/:songId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { songId } = req.params;
    try {
      const song = await Song.findById(songId);
      if (!song) {
        return res.status(404).json({ err: "Song not found" });
      }
      if (song.artist.toString()!== req.user._id.toString()) {
        return res.status(403).json({ err: "You are not authorized to delete this song" });
      }
      await Song.findByIdAndRemove(songId);
      return res.status(200).json({ message: "Song deleted successfully" });
    } catch (err) {
      console.error(`Error deleting song: ${err}`);
      return res.status(500).json({ err: "Error deleting song" });
    }
  }
);





module.exports = router;
