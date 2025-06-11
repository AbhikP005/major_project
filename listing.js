const mongoose = require("mongoose")
const Schema = mongoose.Schema

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://assets.pinterest.com/ext/embed.html?id=14425661317158029",
        set: (v) => v===""? "https://assets.pinterest.com/ext/embed.html?id=14425661317158029": v,
    },
    price: Number,
    location: String,
    country: String
})

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing;