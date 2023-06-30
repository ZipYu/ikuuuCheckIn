const axios = require('axios')

let key;
let expire;
let uidStr;
let emailStr='ur email';
let password='ur password';
let domain = 'https://ikuuu.eu';
const loginURL = domain + '/auth/login?email=' + emailStr + '&passwd=' + password;
const checkinURL = domain + '/user/checkin';
axios.post(loginURL)
  .then(function (response) {
    let array = response.headers['set-cookie'];
    console.log(array)
    let keyArray = array[2].split("; ");
    key = keyArray[0];
    let expireArray = array[4].split("; ");
    expire = expireArray[0];
    let uidArray = array[0].split("; ");
    uidStr = uidArray[0];
    let cookieStr = key + '; ' + expire + ';' + uidStr + '; email=' + emailStr + ';';
    console.log("Cookie:" + cookieStr);

    axios.defaults.headers.common['Cookie'] = cookieStr;
    axios.post(checkinURL)
      .then(function (res) {
        console.log("info" + res.data.msg);
      })
      .catch(function (error) {
        console.log("错误信息:" + error);
      })



  })
  .catch(function (error) {
    console.log(error);
  });
