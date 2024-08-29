const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const mongoUrl = "mongodb+srv://sanchitbajaj2003:root@cluster0.fhfxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const userSchema = new Schema({
    name: String,
    reg: String,
    email: {
        type: String,
        unique: true,
    },
    img:String,
    password: String,
    profileimg: String,
    passingYear: String,
    stream: String,
    role: String,
    request: [String],
    post:[{
        img: String,
        desc: String
    }],
    quiz:[{
        score:String ,
        topic: String,
        totalScore:String
    }],
    mentor: String
}, { timestamps: true });

const User = model("User", userSchema);

const connectdb = async () => {
    await mongoose.connect(mongoUrl);
    console.log('MongoDB Connected...');
};
connectdb();

module.exports = User;
