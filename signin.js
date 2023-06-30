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
if(response.data.ret==0){
      console.log('登录错误：'+response.data.msg);
      process.exit(1);
    }
    console.log(response.data.msg)
    let array = response.headers['set-cookie'];
    let keyArray = array[2].split("; ");
    key = keyArray[0];
    let expireArray = array[4].split("; ");
    expire = expireArray[0];
    let uidArray = array[0].split("; ");
    uidStr = uidArray[0];
    let cookieStr = key + '; ' + expire + ';' + uidStr + '; email=' + emailStr + ';';

    axios.defaults.headers.common['Cookie'] = cookieStr;
    axios.post(checkinURL)
      .then(function (res) {
        console.log(res.data.msg);
      })
      .catch(function (error) {
        console.log("错误信息:" + error);
      })



  })
  .catch(function (error) {
    console.log(error);
  });
