const jwt = require("jsonwebtoken");
const userModel = require('../models/userModel');
const {chatModel} = require('../models/chatModel');
const dealModel = require('../models/dealModel');
const otpModel = require('../models/otpModel');
const dotenv = require('dotenv');
const mailer = require('../nodemailer/index');
const buck = require('../middlewares/upload');
const { default: mongoose } = require("mongoose");
dotenv.config();


const secret = process.env.secret;
class client{
    
    static home=(req,res)=>{
        res.send("hello");
    }

    static getFriends=async(req,res)=>{
        try{
            console.log(req.body)
            let pipeline = [{$match:{email:req.body.email}},{$project:{'chat.name':1,'chat.email':1,'chat.unreadCount':1,_id:0}}]
            let result = await userModel.aggregate(pipeline);
            res.send(result[0].chat)
        }
        catch(err){
            res.status(202).send("something went wrong!")
        }
    }
    static getChat=async(req,res)=>{

        try{

            let pipeline = [{$match:{email:req.body.email}},{$unwind:"$chat"},{$match:{"chat.email":req.body.remail}},{$project:{_id:0,chat:1}}]
            let result = await userModel.aggregate(pipeline);
            res.send(result[0])
        }
        catch(err){
            console.log(err)
            res.status(202).send(err.message)
        }
    }

    static updateChat=async(sender,reciever,message)=>{
        try{

            let sentObj = chatModel({sender:"me",message:message});
            let receivedObj = chatModel({sender:"you",message:message});
            await userModel.updateOne(
                {email:sender},
                {$push:{"chat.$[e].data":sentObj}},
                {arrayFilters:[{'e.email':reciever}]}
            )
            await userModel.updateOne(
                {email:reciever},
                {$push:{"chat.$[e].data":receivedObj}},
                {arrayFilters:[{'e.email':sender}]}
            )
            return true
        }
        catch(err){
            console.log(err)
            return false
        }
    }
    
    static addFriend=async(req,res)=>{

        try{

            let name = await userModel.aggregate([{$match:{email:req.body.remail}},{$project:{name:1,_id:0}}])
            let t1 = {
                email:req.body.remail,
                name:name[0].name,
                unreadCount:0,
                dealId:"",
                data:[]
            }

            let t2 = {
                email:req.body.email,
                name:req.body.name,
                unreadCount:0,
                dealId:"",
                data:[]
            }
            await userModel.updateOne(
                {email:req.body.email},
                {$push:{chat:t1}}
            )
            await userModel.updateOne(
                {email:req.body.remail},
                {$push:{chat:t2}}
            )

            res.send("Success");
        }
        catch(err){
            console.log(err);
            res.status(202).send("User not found or Something went wrong");
        }
    }
    static changeUnreadCount=async(req,res)=>{
        try{
            if(req.body.flag == 0)
            await userModel.updateOne(
                {email:req.body.remail},
                {$set:{"chat.$[e].unreadCount":0}},
                {arrayFilters:[{'e.email':req.body.email}]}
            )
            else
            await userModel.updateOne(
                {email:req.body.remail},
                {$inc:{"chat.$[e].unreadCount":1}},
                {arrayFilters:[{'e.email':req.body.email}]}
            )
            res.send('success');
        }
        catch(err){
            console.log(err);
            res.status(202).send(res.data);
        }
    }

    static getSocId=async(remail)=>{

        try{
            let pipeline = [{$match:{email:remail}},{$project:{_id:0,socId:1}}]
            let res = await userModel.aggregate(pipeline);
            return res[0].socId;
        }
        catch(err){
            return 0;
        }
    }


    static sendMail=async(request,response)=>{

        let otp = Math.floor(Math.random()*10000);
        if(otp<1000)
        otp = otp*10

        let date = new Date;

        let expire = date.getTime() + (600*1000);

        let temp = {
            email:request.body.email,
            otp:`${otp}`,
            expire:expire,
            status:'not verified'
        }

        try{
            if(request.body.email === undefined)
            throw new Error('email is required');


                let result = await userModel.exists({'email':request.body.email});
                 if(result){
                    
                    if(!request.body.shouldExist)
                     throw new Error('User already exists');
                 }
                 else{
                     if(request.body.shouldExist)
                     throw new Error('User does not exists');
                 }


            let res  = await mailer(`${otp}`,request.body.email);
            
            let otpDoc = new otpModel(temp);

            console.log(res)
            if(res.accepted != undefined)
            if(res.accepted.length != 0)
            {
                await otpModel.deleteMany({email:request.body.email})
                await otpDoc.save();
                response.status(res.statusCode).send('success');
            }
            else
            response.status(202).send('something went wrong');
            else
            throw new Error("something went wrong, Please try after sometime");
        }
        catch(err){
            response.status(202).send(err.message);

        }
    }

    static  verifyotp=async(request,response)=>{

        try{
            if(request.body.email === undefined || request.body.otp === undefined)
            throw new Error('email or otp is missing');

             let res = await otpModel.findOne({email:request.body.email,otp:request.body.otp});
             
             let currentTime = (new Date).getTime();
             
             if(res)
             if(res.expire > currentTime){
                
                     await otpModel.deleteMany({email:request.body.email})
                    response.send('Success');
            }
             else{
                 response.status(202).send('Expired')
             }
             else
             throw new Error('Invalid');

        }
        catch(err){
            response.status(202).send(err.message);
        }
    }

    static getImg = async(request,response)=>{
        try {
            let bucket = buck.bucket;
            await bucket.find({ $or: [{ filename: `${request.params.id}.jpeg` }, { filename: `${request.params.id}.png` }] }).toArray((err, files) => {
                if (((files === null || files === undefined )? 0 : files.length) !== 0 && files != undefined) {
                    bucket.openDownloadStreamByName(files[0].filename).pipe(response);
                }
                else
                    response.send("nothing");
            });
        }
        catch (err) {
            response.status(202).send(err.message);
        }
    }

    static async changepassword(request,response){


        try{
            if(request.body.email === undefined || request.body.email === '')
            throw new Error('Email cannot be empty');

            if(request.body.password === undefined || request.body.password === '')
            throw new Error('password cannot be empty');

            if(request.body.password.length < 8)
            throw new Error('password length must be atleast 8 characters')
            

            let res = await userModel.updateOne({'email':request.body.email},{$set:{'password':request.body.password}});

            if(!res.modifiedCount)
            throw Error('New password Cannot be same as OLD password');

            response.send('Success');
        }
        catch(err){
            response.status(202).send(err.message);
        }
    }

    static async signUp(request,response){
        try {
            console.log(request.body)
            let res = await userModel.exists({ email: request.body.email });
            if (res)
                throw new Error("User already exists");
            let data = new userModel(request.body);
            await data.save();
            let token = jwt.sign({ email: request.body.email }, secret);
            response
                .cookie("token", token, {
                    sameSite: "none",
                    httpOnly: "true",
                    path: "/",
                    secure:'false',
                    expires: new Date(new Date().getTime() + 315360000 * 1000),
                  }).send("success");
        }
        catch (err) {
            response.status(202).send(err.message);
        }
    }
    static async edit(request,response){
        try {
            console.log(request.body)
            let res = await userModel.updateOne({email:request.body.email},request.body)
            response.json("success");
        }
        catch (err) {

            console.log(err)
            response.status(202).send(err.message);
        }
    }

    static async login(request,response){
        
        try {
            let res = await userModel.exists({
                email: request.body.email,
                password: request.body.password,
            });
            let token = jwt.sign({ email: request.body.email }, secret);
            if (res)
                response
                .cookie("token", token, {
                    sameSite: "none",
                    httpOnly: "true",
                    path: "/",
                    secure:'false',
                    expires: new Date(new Date().getTime() + 315360000 * 1000),
                  }).send("success");
            else
                response.status(202).send("Please check Your username or password! ");
        }
        catch (err) {
            response.status(202).send(err.message);
        }
    }

    static async uploadDeal(request,response){
        try {
            let id = await userModel.exists({email:request.body.email})
            console.log(id)

            request.body.createdBy = id
            console.log(request.body)
            let data = new dealModel(request.body);
            let res = await data.save();
            console.log(res);
            response.send("success")
        } catch (error) {

            console.log(error.message)
            // console.log(error)
            response.status(202).send("failure")
        }
    }

    static async getClientData(request,response){
        try {
            let pipeline = [{$match:{email:request.body.email}},{$project:{name:1,email:1,phone:1,successfulDeals:1}}]
            let res = await userModel.aggregate(pipeline);
            if(res.length != 0)
            response.send(res[0]);
            else 
            throw new Error("user notfound");
        } catch (error) {
            response.status(202).send(error.message)
        }
    }

    static async getAllDeals(request,response){
        try {
            let pipeline = [{$match:{status:"incomplete"}},{$sort:{type:1}}]
            let res = await dealModel.aggregate(pipeline);
            response.send(res); 
        } catch (error) {
            console.log(error.message)
            response.status(202).send(error.message)
        }
    }

    static async getDealData(request,response){
        try {
            let res = await dealModel.findOne({id:request.body.id});
            let a = []

            if(res)
            a.push(res);
            response.send(a);
        } catch (error) {
            response.status(202).send(error.message)
        }
    }

    static async getpersonalData(request,response){
        try {
            let pipeline = [{$match:{email:request.body.email}},{$project:{name:1,email:1,password:1,phone:1,successfulDeals:1}}]
            let res = await userModel.aggregate(pipeline);
            response.send(res[0]);
        } catch (error) {
            response.status(202).send(error.message);
        }
    }

    static async getMyDeals(request,response){
        try {
            let pipeline = [{$match:{createdBy:mongoose.Types.ObjectId(request.body.id)}}]
            let res = await dealModel.aggregate(pipeline);
            response.send(res);
        } catch (error) {
            response.status(202).send(error.message);
        }
    }

    static async deleteDeal(request,response){
        try {

            let res = await dealModel.deleteOne({id:request.body.id});
            console.log(res)
            response.send("Success")
        } catch (error) {
            response.status(202).send(error.message)
        }
    }

    static async logout(request,response){
        try {
            response.clearCookie("token").send("success")
        } catch (error) {
            
        }
    }

    static async updateDeal(request,response){
        try {

            let dat = `${new Date()}`
            let temp = dat.split(' ');
            let date = temp[0]+" "+temp[1]+" "+temp[2]+" "+temp[3]+" "+temp[4]
            console.log(date)
            console.log("SAASFAafafa")
            await dealModel.updateOne({id:request.body.id},{$set:{status:"complete",dealer:request.body.remail,dealDate:date}});

            let res = await userModel.updateOne(
                { email: request.body.email},
                { $set: { "chat.$[e].dealId": "" } },
                { arrayFilters: [{ "e.email": request.body.remail }]}
              );
            
            await userModel.updateOne(
                {email:request.body.email},
                {$inc:{successfulDeals:1}}
            )
            await userModel.updateOne(
                {email:request.body.remail},
                {$inc:{successfulDeals:1}}
            )
            response.send("Success");
        } catch (error) {
            response.status(202).send(error.message);
        }
    }

    static async getHistory(request,response){
        try {
            
            let pipeline = [{$match:{ $or:[{createdBy:mongoose.Types.ObjectId(request.body.id)},{dealer:request.body.email}]}}]
            let res = await dealModel.aggregate(pipeline);
            console.log(res)
            response.send(res)
        } catch (error) {
            esponse.status(202).send(error.message);
        }

    }
}

module.exports = client;