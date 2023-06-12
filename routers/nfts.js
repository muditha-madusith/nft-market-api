const express = require('express');
const router = express.Router();
const Nft = require('../models/nftModel');
const authMiddleware = require('../middleware/authMiddleware');
var cors = require('cors');


router.use(cors());

// Create NFT
router.route('/create').post(authMiddleware, (req, res) => {
  // Retrieve the logged-in user ID from the request
  const userId = req.user.id;

  // Extract the NFT data from the request body
  const { name, price, description, image, quantity } = req.body;

  // Create a new NFT with the user ID
  const newNft = new Nft({
    name,
    price,
    description,
    image,
    quantity,
    creator: userId
  });

  // Save the new NFT to the database
  newNft
    .save()
    .then(nft => {
      res.json(nft);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Failed to create NFT' });
    });
});


module.exports = router;