const mongoose = require("mongoose");

// how to create a model
//step-1 : require mongose
//step-2 : create a monngoose schema(structure of the user)
//step-3 : create a model

//step-2
const Playlist = new mongoose.Schema({

        name:{
            type : String,
            required : true,
        },
        thumbnail : {
            type : String,
            required : true,
        },
        owner:{
            type : mongoose.Schema.ObjectId,
            ref : "user",
        },
        songs :[
        {
            type :mongoose.Types.ObjectId,
            ref : "song"
        },
    ],
    collaborators: [{
        type : mongoose.Types.ObjectId,
        ref : "user"
    }]
});

//step-3
const PlaylistModel = mongoose.model("Playlist",Playlist);

module.exports = PlaylistModel;