module.exports = function (app, isLoggedIn, shareCV, getTime, upload, Email, EmailNTD, crypto, path, EmailMarketing, Send_Email) {
  var nodemailer = require('nodemailer');
}
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}