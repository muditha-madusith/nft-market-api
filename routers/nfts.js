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


// // Get NFTs created by the logged-in user
// router.route('/my-nfts').get(authMiddleware, (req, res) => {
//   // Retrieve the logged-in user ID from the request
//   const userId = req.user.id;

//   // Find all NFTs with the creator field matching the user's ID
//   Nft.find({ creator: userId })
//     .then(nfts => {
//       res.json(nfts);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({ error: 'Failed to retrieve NFTs' });
//     });
// });


// Get NFTs created by the logged-in user
router.route('/my-nfts').get((req, res) => {
  // Retrieve the logged-in user ID from the request
  let userId;

  // Check if id exists in the Authorization header or req.cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    userId = req.headers.authorization.split(' ')[1];
  } 
  
  // Check if id exists
  if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
  }

  // Find all NFTs with the creator field matching the user's ID
  Nft.find({ creator: userId })
    .then(nfts => {
      res.json(nfts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Failed to retrieve NFTs' });
    });
});


module.exports = router;