const mongoose = require("mongoose");

// how to create a model
//step-1 : require mongose
//step-2 : create a monngoose schema(structure of the user)
//step-3 : create a model

//step-2
const User = new mongoose.Schema({
    firstName :{
        type : String,
        required : true,
    },
    password:{
        type:String,
        required : true,
        private : true,
    },
    lastName :{
        type : String,
        required : true,
    },
    email:{
        type : String,
        required : true,
    },
    username : {
        type : String,
        required : true,
    },
    likedSongs:{
        //we will change this to array later
        type : String,
        default : "",
    },
    likedPlaylist:{
        //we will change this to array later
        type : String,
        default : "",//we are not using any data here so we use empty string as default
    },
    subscribedArtist :{
        //we will change to array later
        type : String,
        default : "",
    },
});

//step-3
const UserModel = mongoose.model("User",User);

module.exports = UserModel;