const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "27e231b9c1d5ad",
      pass: "9eb070f68fa7cb"
    }
});