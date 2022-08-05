const httpStatus = require('http-status');
// const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const dummy = require('mongoose-dummy');
const User = require('../models/user.model');
const Task = require('../models/task.model');
const NodeCache = require('node-cache');

const fs = require('fs');
// const { ConfigurationServicePlaceholders } = require('aws-sdk/lib/config_service_placeholders');
const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];



const getAllUsers = async () => {
  return User.find();
}

const MAX_ITEMS_PER_PAGE = 5;
const getUsersByPagination = async (offset) => {
  let postSkip = 0;
  if (offset) {
    postSkip = (Number(offset) - 1) * MAX_ITEMS_PER_PAGE;
  }
  return User.find()
              .skip(postSkip)
              .limit(MAX_ITEMS_PER_PAGE);
}

const getlatestUsers = async (ofs) => {
  return User.find().sort({ $natural: -1 }).limit(ofs);
}



const getUsersByScrolling = async () => {
  // console.log(query)
  const g = await User.find().lean();
  let lengthOfUsers = g.length;
  return lengthOfUsers;
}

const updateUserById = async(id,fields) =>{
  return User.findByIdAndUpdate(id,fields,{new: true});
}
const deleteUserById = async(id) => {
  return User.findByIdAndDelete(id);
}
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const user = await User.create(userBody);
  return user;
};

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function getRndUrls () {
  const urls = ["https://i.pinimg.com/474x/f0/7f/df/f07fdf50b2fe9d94c387dc57dd5b6999.jpg",
                "https://i.pinimg.com/474x/9a/c9/d9/9ac9d92dba7d304fea3bb2b693c1a280.jpg",
                "https://i.pinimg.com/564x/bd/f0/da/bdf0da7c2bcead4dc93a29f05935416d.jpg",
                "https://i.pinimg.com/474x/3f/29/b6/3f29b60ec307e01e6494696fdb16722c.jpg"
                

]
  n = urls.length;
  return urls[Math.floor(Math.random()*n)];
}

// create fake users
const createfake = () => {
  let rndUser = dummy(User, {
    ignore: ignoredFields,
    returnDate: true
  })
  return (rndUser);
}

const createfakeUser = async(id) => {
  let num = parseInt(id);
  // console.log(num);
  let b = [];
  let d = 0;
  const colors = ["red", "green", "black", "blue", "white", "pink", "yellow", "purple", "brown"];
  while (b.length < num) {
    try {
      let a = await createfake();
      if (a) {
        if (a['email'].includes('gmail.com')) {
          let c = new User();
          let e = getRndUrls();
          c['name'] = a['name'];
          c['username'] = a['username'];
          c['gender'] = a['gender'];
          c['age'] = getRndInteger(10,100);
          c['email'] = a['email'];
          c['password'] = a['password'];
          c['token'] = a['token'];
          c['phoneNumber'] = a['phoneNumber'];
          c['role'] = a['role'];
          c['isEmailVerified'] = a['isEmailVerified'];
          c['shortId'] = a['shortId'];
          c['color'] = colors[getRndInteger(0,colors.length)];
          c['genZProfile'] = a['genZProfile'];
          c['genZProfile']['imageURL'] = e;
          c['clientProfile'] = a['clientProfile'];
          c['clientProfile']['imageURL'] = e;
          c['reviews'] = a['reviews'];
          c['report'] = a['report'];
          c['timestamps'] = a['timestamps'];
              
          let saved = await c.save();
          console.log(saved);
          if (saved) {
            d = d + 1;
            console.log(d);
          }
          console.log('after saved');
          b.push(c);
        }

      }
    } catch (error) {
      console.log(error);
    }
    // console.log(b);
}
}

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  console.log(id);
  return User.findOne({_id: id});
};

/**
 * 
 * @param {*Object<String,Any>} field 
 * @returns {*Promise<User>}
 */
const getUserByField = async (field) => {
  return User.findOne(field);
};


/**
 * 
 * @param {*Object<String,Any>} field 
 * @returns {*Promise<Boolean>}
 */
const fieldExist = async (field) => {
  return User.exists(field);
}



module.exports = {
  getAllUsers,
  getUsersByPagination,
  getlatestUsers,
  getUsersByScrolling,
  createUser,
  createfakeUser,
  getUserById,
  getUserByField,
  fieldExist,
  updateUserById,
  deleteUserById
};