const express = require('express');
const router = express.Router();
const Nft = require('../models/nftModel');
const authMiddleware = require('../middleware/authMiddleware');
var cors = require('cors');

const bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({ extended: true }));

router.use(express.json());


router.use(cors());

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Import the Stripe library
const { Payment } = require('../models/paymentModel'); // Import the Payment model

// Buy NFT
router.route('/buy/:id').post(async (req, res) => {

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {

    const {buyer} = req.body;

    const nftId = req.params.id;

    const nft = await Nft.findById(nftId);

    // Check if the NFT exists
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    // Check if the NFT quantity is greater than 0
    if (nft.quantity <= 0) {
      return res.status(400).json({ error: 'NFT is out of stock' });
    }

    // Calculate the total price for the NFT
    const totalPrice = nft.price;

    // console.log(userId)
    console.log(typeof(buyer))

    // Create a new payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency: 'usd',
      metadata: {
        nftId,
        buyer
      },
    });

    // Create a new payment record in the database
    const payment = new Payment({
      nft: nftId,
      buyer: buyer,
      amount: totalPrice,
      paymentIntentId: paymentIntent.id,
    });

    // Save the payment record to the database
    await payment.save();

    // Decrement the NFT quantity by 1
    nft.quantity -= 1;
    await nft.save();

    // Return the client secret and payment intent ID to the client
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to buy NFT' });
  }
});


// Get NFTs bought by the logged-in user
router.route('/my-bought-nfts/:id').get(async (req, res) => {
  try {
    // Retrieve the logged-in user ID from the request
    const userId = req.params.id;

    // Find all payments made by the user in the database
    const payments = await Payment.find({ buyer: userId });

    // Extract the NFT IDs from the payments
    const nftIds = payments.map(payment => payment.nft);

    // Find the NFTs with the extracted IDs in the database
    const nfts = await Nft.find({ _id: { $in: nftIds } });

    res.json(nfts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to retrieve bought NFTs' });
  }
});



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

  Nft.find({ creator: userId })
    .then(nfts => {
      res.json(nfts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Failed to retrieve NFTs' });
    });
});


// Get all NFTs
router.route('/all-nfts').get((req, res) => {
  // Retrieve all NFTs from the database
  Nft.find()
    .then(nfts => {
      res.json(nfts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Failed to retrieve NFTs' });
    });
});



// Get NFT details by NftID
router.route('/nfts/:id').get((req, res) => {

  const nftId = req.params.id;

  // Find the NFT by its ID in the database
  Nft.findById(nftId)
    .then(nft => {
      if (!nft) {
        return res.status(404).json({ error: 'NFT not found' });
      }
      res.json(nft);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Failed to retrieve NFT' });
    });
});


// Get NFTs created by a specific user
router.route('/nfts/creator/:id').get((req, res) => {
  const creatorId = req.params.id;

  // Find all NFTs with the creator field matching the specified user's ID
  Nft.find({ creator: creatorId })
    .then(nfts => {
      res.json(nfts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Failed to retrieve NFTs by creator ID' });
    });
});


// Get NFTs by name letters
router.route('/nfts/by-name/:letters').get((req, res) => {
  const letters = req.params.letters;

  // Find NFTs whose name contains the specified letters
  Nft.find({ name: { $regex: letters, $options: 'i' } })
    .then(nfts => {
      res.json(nfts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Failed to retrieve NFTs by name letters' });
    });
});



module.exports = router;