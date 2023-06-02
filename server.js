const express = require('express');
const bodyParser = require("body-parser");
const user = require('./routers/users.js')
// const nft = require('./routers/nfts.js')
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
require("dotenv").config();


const app = express();

const PORT = process.env.PORT || 5000;


app.use('/api/user',user);

// app.use('/api/nft',nft);


app.use(cors());
app.use(bodyParser.json());


//mongodb connect
const uri = process.env.MONGODB_URL;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connect(uri)
.then(()=>{
    console.log("Connected to the Mongodb...")
}).catch((err)=>{
    console.log(err)
})

app.listen( PORT,
    () => console.log(`App is running on port ${PORT}`)
);