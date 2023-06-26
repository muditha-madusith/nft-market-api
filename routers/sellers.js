const express = require('express');
const router = express.Router();
const Seller = require('../models/sellerModel')
const authMiddleware = require('../middleware/authMiddleware');
var cors = require('cors');


router.use(cors());



router.route('/create/seller').post(authMiddleware, (req, res) => {
    // Retrieve the logged-in user ID from the request
    const userId = req.user.id;

    // Extract the NFT data from the request body
    const { bankName, accountNumber, branch, fullName, branchCode } = req.body;

    // Create a new NFT with the user ID
    const newSeller = new Seller({
        bankName,
        accountNumber,
        branch,
        fullName,
        branchCode,
        seller: userId
    });

    // Save the new Seller to the database
    newSeller
        .save()
        .then(seller => {
            res.json(seller);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Failed to register seller' });
        });
});


// Create a route for getting seller details based on user ID
router.route('/get-seller/:userId').get((req, res) => {
    const userId = req.params.userId;

    // Find the seller using the provided user ID
    Seller.findOne({ seller: userId })
        .then(seller => {
            if (!seller) {
                return res.status(404).json({ error: 'Seller not found' });
            }
            res.json(seller);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Failed to retrieve seller details' });
        });
});


module.exports = router;