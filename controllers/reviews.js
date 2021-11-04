const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const { campId } = req.params;
  const campground = await Campground.findById(campId);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Successfully!!! Create a new review.");
  res.redirect(`/campgrounds/${campId}`);
};

module.exports.deleteReview = async (req, res) => {
  const { campId, reviewId } = req.params;
  await Campground.findByIdAndUpdate(campId, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully!!! Deleted the review!!!");
  res.redirect(`/campgrounds/${campId}`);
};
