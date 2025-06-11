const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const Listing = require("../Major_Project/models/listing.js");

const MONGO_URL =
  "mongodb+srv://pritamkundu144:uIu4jMuiQCnBL6IH@cluster0.bdlozc5.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0";

main()
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("I am root");
});

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//New Route
app.get("/listings/new", wrapAsync((req, res) => {
  res.render("listings/new.ejs");
}));

//Create Route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    if(!req.body.listing){
      throw new ExpressError(400, "Send valid data for listing!")
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
  if(!req.body.listing){
      throw new ExpressError(400, "Send valid data for listing!")
    }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //unpacking all data from object and getting them one by one
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

// app.get("/testlisting", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Koh Lanta, Thailand",
//         country: "India"
//     })

//     await sampleListing.save()
//     console.log("sample is saved");
//     res.send("successful testing")
// })




app.use((err, req, res, next) => {
  let {statusCode=500, message="Something went wrong..."} = err
  res.status(statusCode).render("error.ejs", {message})
  // res.status(statusCode).send(message);    //Handling unexpected error
});

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});
