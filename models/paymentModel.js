const mongoose = require('mongoose');

// Define the Payment schema
const paymentSchema = new mongoose.Schema({
  nft: {
    type: String,
    required: true,
  },
  buyer: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentIntentId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
 

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment };
