const CryptoJS = require("crypto-js");

function encryptText(value) {
  if (typeof value !== "string") {
    value = JSON.stringify(value);
  }
  return CryptoJS.SHA256(value.trim().toLowerCase()).toString(CryptoJS.enc.Hex);
}

module.exports = {
  encryptText
};
