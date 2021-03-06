const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_160,h_100,c_fill");
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: {
      type: String,
    },
    images: [ImageSchema],
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    location: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  opts
);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
    <strong>
      <a class="link-success" href="/campgrounds/${this._id}">
        ${this.title}
      </a>
    </strong>
    <p>${this.description.substring(0, 30)}...</p>
    `;
});

CampgroundSchema.post("findOneAndDelete", async function (campground) {
  if (campground) {
    await Review.remove({ _id: { $in: campground.reviews } });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
