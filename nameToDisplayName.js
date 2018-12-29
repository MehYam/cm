db.users.find({ displayName: null }).snapshot().forEach( user => {

   db.users.update(
      {  _id: user._id },
      {
         $set: {
            displayName: user.name
         }
      }
   );
});