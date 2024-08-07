// Imports
const { Schema, model } = require("mongoose");

// Subscription schema
const subscriptionSchema = new Schema(
  {
    subscriptionType: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: Date.now + 1,
    },
    username: {
      type: String,
      required: true,
    },
  },
  {
    id: false,
  }
);

// Creates Subscription model with subscriptionSchema
const Subscription = model("subscription", subscriptionSchema);

// Exports
module.exports = Subscription;