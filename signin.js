const emailStr = 'ur email';
const password = 'ur password';
const domain = 'https://ikuuu.eu';
const loginURL = domain + '/auth/login?email=' + emailStr + '&passwd=' + password;
const checkinURL = domain + '/user/checkin';
axios.post(loginURL)
  .then(function (response) {
    if (response.data.ret == 0) {
      console.log('登录错误：' + response.data.msg);
      process.exit(1);
    }
    console.log(response.data.msg)
    let array = response.headers['set-cookie'];
    let keyArray = array[2].split("; ");
    let expireArray = array[4].split("; ");
    let uidArray = array[0].split("; ");
    let cookieStr = keyArray[0] + '; ' + expireArray[0] + ';' + uidArray[0] + '; email=' + emailStr + ';';

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
