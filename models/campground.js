var mongoose = require("mongoose");

// schema setup
var campSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    desc: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("CampGround", campSchema);
