const mongoose = require("mongoose");
const validator = require("validator");
const responseSchema = require("./response.model");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Non binary", "Prefered not to choose"],
    },
    age: {
      type: Number,
      min: 10,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    token: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      private: true, // used by the toJSON plugin
    },
    phoneNumber: {
      type: String,
      /*validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error("Invalid phone number");
        }
      },*/
    },
    role: {
      type: String,
      enum: ["user", "vip", "admin"],
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    shortId: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    genZProfile: {
      username: {type: String},
      imageURL: {type: String},
      about: {type: String},
      points: {type: Number},
    },
    clientProfile: {
      username: {type: String},
      imageURL: {type: String},
      about: {type: String},
      points: {type: Number},
    },
    reviews: [
      {
        responseSchema,
        rating: {
          type: Number,
          min: 0,
          max: 5,
        },
        isGenZReview: {
          type: Boolean,
          required: [
            true,
            "A review must be either about this user GenZ profile or client profile ",
          ],
        },
      },
    ],
    report: {
      type: String,
      min: 2,
      max: 100,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
