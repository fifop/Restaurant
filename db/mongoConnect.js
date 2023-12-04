require('dotenv').config();

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  // כדי למנוע הצגת אזהרה
  mongoose.set('strictQuery', false);
  // וזה לווינדוס 11
  await mongoose.connect(process.env.MONGO_URI);
  console.log("mongo connect smart local");
  
}

// const mongoose = require('mongoose');
// mongoose.connect('mongodb+srv://fifop55:852258Op@cluster0.cblnwrh.mongodb.net/')


// const db =mongoose.connection;
// db.on('error',console.error.bind(console,'connection error:'));
// db.once('open',()=>{
//   console.log('mongo connected');
// });

// module.exports=db;