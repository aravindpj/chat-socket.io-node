const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const { generateMessage, generateLocation } = require("./util/message");
const { isRealString } = require("./util/checkString");
const User = require("./util/userSchema");
const app = express();

const server=http.createServer(app)
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

let users=new User

io.on("connection",(socket)=>{
    console.log('a new user connected');

    socket.on("join",(params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)) {
            // throw a error
            return callback("The name or room name are not correct")
        }
        if(users.userExist(params.name)) return callback("user in online")
        // create room or join
        socket.join(params.room)
        users.removeUser(socket.id)
        users.addUser(socket.id,params.name,params.room)
        // send a list new user data in current room
        io.to(params.room).emit("updateUsersList",users.getUsersList(params.room))
        
       // send message new user joined to current room
        socket.emit("newMessage",generateMessage("Admin","Welcome to chat app!"))
        socket.broadcast.to(params.room).emit("newMessage",generateMessage("Admin", `${params.name} joined this ${params.room} room chat`))
    })


    socket.on("createMessage",(message,callback)=>{
        let user = users.getUser(socket.id)
        if(user) io.emit("newMessage",generateMessage(user.name,message.text))
        callback() 
    })
   
    socket.on("createLocationMessage",(coords)=>{
        let user=users.getUser(socket.id)
        console.log(user)
        if(user) io.emit("newLocationMessage",generateLocation(user.name,coords.lat,coords.lng))
    })
    
    socket.on("disconnect",()=>{
       console.log(`user disconnected`)
       // find user
       let user=users.removeUser(socket.id)
       // then send message to room user exit
       if(user){
          io.to(user.room).emit("newMessage",generateMessage("Admin",`${user.name} exit`))
          io.to(user.room).emit("updateUsersList",users.getUsersList(user.room))
       }
    })
})

server.listen(3000, () => {
  console.log(`server started`);
});
