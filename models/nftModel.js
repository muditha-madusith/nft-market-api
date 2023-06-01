const mongoose = require('mongoose')

const nftSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a NFT name"]
        },
        price: {
            type: Number,
            required: [true, "Please enter price for your NFT"]
        },
        description: {
            type: String,
            required: [true, "Please enter description for your NFT"]
        },
        image: {
            type: String,
            required: [true, "Please upload your NFT url"]
        }
    },
)


const Nft = mongoose.model('Nft', nftSchema);

module.exports = Nft;