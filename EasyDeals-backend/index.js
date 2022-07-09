const http = require("http");
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const userModel = require("./models/userModel");
const client = require('./services/client')

const app = express();

mongoose.connect("mongodb://localhost:27017/easydeals", (err, res) => {
  if (err) console.log(err.message);
  else console.log("connected to DB");
});

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://dp.turntbloke.tech", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(routes);

const server = http.createServer(app);

let io = new Server(server, {
  cors: {
    origin: "*",
  },
});
console.log(io);
io.on("connection", (socket) => {
  socket.on("connected", async (email) => {
    await userModel.updateOne({ email: email }, { socId: socket.id });
  });

  socket.on("sendMessage", async (email, remail, message, key) => {
    console.log(key);
    let socId = await client.getSocId(remail);
    console.log(email,remail);
    let res = await client.updateChat(email, remail, message);
    if (res) {
      socket.to(socId).emit("receiveMessage", email, message, key);
      console.log("shiva");
    }
  });

  socket.on('dealupload',()=>{
    console.log("deal ipload")
    socket.emit('updateDeals')
  })

  socket.on('addfriend',()=>{
    socket.emit('updatefriends')
  })
  
  socket.on('deletedeal',()=>{
    socket.emit('updateMyDeals')
  })

  socket.on("updateDealId", async (email, remail, dealId) => {
    try {
      
      let res = await userModel.updateOne(
        { email: email },
        { $set: { "chat.$[e].dealId": dealId } },
        { arrayFilters: [{ "e.email": remail }]}
      );
      console.log(res)
      socket.emit('resDealId','success');
    } catch (error) {
        console.log(error)
        socket.emit('resDealId','failure');
    }

  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log("Server started at port 5000");
});
