class User{
   constructor(){
      this.users=[]
   }
   addUser(id,name,room){
      let user={id,name,room}
      this.users.push(user)
      return this.users
   }
   getUsersList(room){
      return this.users.filter(data=>data.room===room).map(user=>user.name)
   }
   getUser(id){
      return this.users.find(data=>data.id===id)
   }
   removeUser(id){
    let user = this.getUser(id);

    if(user){
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
   }
   userExist(name){
     return this.users.find(user=>user.name===name)
   }
}

module.exports=User