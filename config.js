import mongoose from  "mongoose";
import Module from "module";

const connect=mongoose.connect("mongodb+srv://admin:varun123@cluster0.ll4qt.mongodb.net/");


connect.then(()=>{
    console.log("database connected successfullyy");

}).catch(()=>{
    console.log("database not connected");
});

const loginSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const db =new mongoose.model("User",loginSchema);
Module.exports=db;
export default db;






