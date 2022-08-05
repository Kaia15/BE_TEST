const ApiError = require("../utils/ApiError");
const Task = require("../models/task.model");
const User = require('../models/user.model');
const httpStatus = require("http-status");
const dummy = require('mongoose-dummy');
const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];

const faketask = () => {
  let l = dummy(Task, {
    ignore: ignoredFields,
    returnDate: true
  })
  return (l);
}

const generateRandomUserId = (arr) => {
  let randomInd;
  randomInd = Math.floor(Math.random()*(arr.length));
  return arr[randomInd];
}

const RndInt = (arr) => {
  return Math.floor(Math.random()*(arr.length));
}

const RndTime = () => {
  return Math.floor(Math.random()*((1000000000) + 10000000));
}

const RndAddress = (c) => {
  let vnAdd = [{city: "Da Nang", address: "15 Tran Phu Street"}, {city: "Ha Noi", address: "79A Tran Hung Dao, Hoan Kiem District"},
               {city: "Ho Chi Minh", address: "421/8 Su Van Hanh Street, District 10"}, {city: "Hue", address: "63 To Huu , Block C2"},
               {city: "Nha Trang", address: "92/37 Hung Vuong"}, {city: "Bien Hoa", address: "28 Line 3A"},
               {city: "Buon Ma Thuot", address: "137/2 Ama Jhao"}, {city: "Vinh", address: "23 Le Loi"},
               {city: "Hai Duong", address: "Km 3"}, {city: "Thu Duc", address: "20 To Ngoc Van"},
               {city: "Quy Nhon", address: "145A Tran Hung Dao"}, {city: "Can Tho", address: "60 Xo Viet Nghe Tinh"},
               {city: "Vung Tau", address: "47 Ba Cu"}, {city: "Da Lat", address: "25 Phan Nhu Thach"}];
  let singAdd = [{city: "Singapore", address: "8 Claymore Hill, Orchard, 229572 Singapore"}, {city: "Singapore", address: "7500B Beach Rd, 199592 Singapore"},
                 {city: "Singapore", address: "80 Nepal Park, 139409 Singapore"}, {city: "Singapore", address: "76 Boat Quay, Boat Quay, 049864 Singapore"},
                 {city: "Singapore", address: "2 Serangoon Rd, 218227 Singapore"}];
  let output_1 = vnAdd.find((ad) => {
    return ad.city === c;
  })
  let output_2 = singAdd.find((ad) => {
    return ad.city === c;
  })
  if (!output_1) {
    return output_2;
  } else {
    return output_1;
  }
}

const Rndprice = () => {
  return Math.floor(Math.random(100) + 1);
}

const getTaskByField = async (field) => {
    return Task.find(field);
};

const getTask = async (id) => {
  return Task.findById(id);
};
const createTask = async (taskBody) => {
  if (!taskBody) {
    throw new ApiError(httpStatus.NOT_FOUND, "task body is empty");
  }
  return Task.create(taskBody);
};

const createfakeTask = async (id) => {
  const n = id;
  const num = parseInt(n);
  console.log(num);
  let b = [];
  let count = 0;
    while (b.length < num)
    {
      try {
      const f = await faketask();   
      
      if (f) {
        const c = new Task;
        const cities = ["Ha Noi", "Ho Chi Minh", "Da Nang", "Bien Hoa", "Can Tho", "Buon Ma Thuot", "Nha Trang", 
                        "Vung Tau", "Hue", "Da Lat",
                        "Vinh", "Thu Duc", "Hai Duong", "Quy Nhon",
                        "Singapore"];
        
        const categories = ["design", "security", "back-end", "fix-bug", "deploy"];

        const descriptions = ["Instructing several technology camps as needed. Tech camps include Coding (Scratch, Java, Python, C++)", 
                              "Being a role model for campers and staff, and arriving every day with an inclusive, professional, upbeat, and positive attitude",
                              "Provide ongoing troubleshooting and technical support to staff and students",
                              "Assist with debugging code, project backup, and computer clean-up",
                              "Communicate tech issues quickly and effectively to company headquarters and offer solutions"];
        
        const g = await User.find().lean();
        let d = generateRandomUserId(g);
        let e = generateRandomUserId(g);
        let time = RndTime();
        let Rndcity = cities[RndInt(cities)];
        let dl = new Date(f['deadline'].getTime() + time);
        let bidArr = f['bidBy'];

        bidArr.map((bid) => {
          let user = generateRandomUserId(g);
          bid.bidder = user._id;
          bidderName = user.name;
          if (bid.price <= 1) {
            bid.price = Rndprice();
          }
          // console.log(bid.bidder);
          // console.log(bidderName);
        });

        // console.log(bidArr);
        // console.log(f['description']);

        c['location'] = f['location'];
        c['title'] = f['title'];
        c['deadline'] = dl;
        c['createdBy'] = d._id;
        c['takeCareBy'] = e._id;
        c['timeofTask'] = f['timeofTask'];
        c['finalPrice'] = f['finalPrice'];
        c['initialPrice'] = f['initialPrice'];
        c['address'] = RndAddress(Rndcity).address;
        c['city'] = Rndcity;
        c['progress'] = f['progress'];
        c['category'] = categories[RndInt(categories)];
        c['description'] = descriptions[RndInt(descriptions)];
        c['payment'] = f['payment'];
        c['takeCareAt'] = f['takeCareAt'];
        c['bidBy'] = bidArr;
        c['comments'] = f['comments'];

        let savedtask = await c.save();
        if (savedtask) {
            count += 1;
            console.log(count);
        }
        b.push(c);
        // console.log(c.description);
      }

      } catch (error) {
        console.log(error);
      }
    }
    // console.log(b);
}

const updateTask = async (id, field) => {
  if (!field) {
    throw new ApiError(httpStatus.NOT_FOUND, "field is empty");
  }
  return Task.findByIdAndUpdate(id,field, { new: true });
};

const deleteTask = async (id) => {
  return Task.findByIdAndDelete(id);
};



module.exports = {
  getTaskByField,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  createfakeTask,
};
