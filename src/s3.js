const multer = require("multer");
const aws = require("aws-sdk");
const sharp = require("sharp");
const fetch = require('node-fetch');


const s3 = new aws.S3();
const Bucket = process.env.AWS_BUCKET_NAME;
const upload = multer();


const resizedImage = async (imageBuffer) => {
  const image = sharp(imageBuffer);
  const {width,height} =  await image.metadata();
  return image.resize(Math.floor(0.7 * width), Math.floor(0.7 * height), {
    fit: "contain",
  });
};

const uploadImage = (imageStream, filename) => {
  //const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: Bucket,
    Body: imageStream,
    Key: filename,
  };
  return s3.upload(uploadParams).promise();
};

const getImage = async (key) => {
  const response = await fetch(process.env.CLOUD_FRONT_URL + key);
  const blob_image = await response.blob();
  return blob_image;
}

module.exports = {
  upload,
  uploadImage,
  getImage,
  resizedImage,
};
