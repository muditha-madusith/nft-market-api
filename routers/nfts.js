const express = require('express');
const router = express.Router();
let Nft = require("../models/nftModel");

router.use(express.json());

router.route("/create").post((req,res)=>{

    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const image = req.body.image;

    const newNft = new Nft({
        name,
        price,
        description,
        image
    })

    newNft.save().then(()=>{
        res.send("NFT Added....")
    }).catch((err)=>{
        console.log(err);
    })

});


module.exports = router;