// backend/config/cloudinaryConfig.js

import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: "petpals-uploads",
  api_key: "138677287291171",
  api_secret: "ZynABdt-k08Kg-OXVTnpdcBlr2A",
});

export default cloudinary;
