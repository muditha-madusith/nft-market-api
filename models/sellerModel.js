const mongoose = require('mongoose')

const sellerSchema = mongoose.Schema(
    {
        bankName: {
            type: String,
            required: [true, "Please enter a your bank name"]
        },
        accountNumber: {
            type: Number,
            required: [true, "Please enter your account number"]
        },
        branch: {
            type: String,
            required: [true, "Please enter bank branch name"]
        },
        fullName: {
            type: String,
            required: [true, "Please enter your full name"]
        },
        seller: {
            type: String,
            required: [true, "Please login before create the NFT"]
        },
        branchCode: {
            type: Number,
            required: [true, "Please enter your bank branch code"]
        }
    },
    {
        versionKey: false
    }
)


const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;