const mongoose = require("mongoose");

const { Schema } = mongoose;
// how to create a model
//step-1 : require mongose
//step-2 : create a monngoose schema(structure of the user)
//step-3 : create a model

//step-2
const Song = new mongoose.Schema({

        name:{
            type : String,
            required : true,
        },
        thumbnail : {
            type : String,
            required : true,
        },
        track :{
            type : String,
            required : true,
        },
        artist:{
            type : mongoose.Types.ObjectId,
            ref : "User",

        }
});

//step-3
const SongModel = mongoose.model("Song",Song);

module.exports = SongModel;