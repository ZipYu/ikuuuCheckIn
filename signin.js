const axios = require('axios')
const { initInstance, getEnv, updateCkEnv } = require('./qlApi.js')
const notify = require('./sendNotify')

const domain = 'https://ikuuu.me';
const checkinURL = domain + '/user/checkin';
const allMessage = [];

async function getEmailAndPassword() {

  let instance = null
  try {
    instance = await initInstance()
  } catch (e) { }

  let ikuuu = process.env.ikuuu || []
  try {
    if (instance) ikuuu = await getEnv(instance, 'ikuuu')
  } catch (e) { }

  let ikuuuUserArray = [];
  if (Array.isArray(ikuuu)) ikuuuUserArray = ikuuu

  else if (process.env.ikuuu.indexOf('\n') > -1) {
    console.log(123);
    ikuuuUserArray = process.env.ikuuu.split('\n');
  }
  else {
    ikuuuUserArray = [process.env.ikuuu];
  }
  console.log('共找到' + ikuuuUserArray.length + '个账号');
  if (ikuuuUserArray.length == 0) {
    console.log("没有找到账号");
    process.exit(1);
  }
  return ikuuuUserArray;
}
async function getCookies(email, password) {
  let emailStr= email.replace(/^(.{0,3}).*@(.*)$/, "$1***@$2");
  console.log('开始登录:' + emailStr)
  return new Promise((cookie) => {
    let loginURL = domain + '/auth/login?email=' + email + '&passwd=' + password;

    axios.post(loginURL)
      .then(function (response) {
        if (response.data.ret == undefined || response.data.ret == 0) {
          console.log('登录错误：' + response.data.msg);
          return;
        }
        console.log(emailStr + response.data.msg);
        allMessage.push(emailStr + response.data.msg);
        let array = response.headers['set-cookie'];
        let keyArray = array[2].split("; ");
        let expireArray = array[4].split("; ");
        let uidArray = array[0].split("; ");
        let cookieStr = keyArray[0] + '; ' + expireArray[0] + ';' + uidArray[0] + '; email=' + email + ';';
        cookie(cookieStr);
      })
      .catch(function (error) {
        console.log(error);
      });
  })

}

async function signIn(eamil, cookie) {
    let emailStr= eamil.replace(/^(.{0,3}).*@(.*)$/, "$1***@$2");
  return new Promise((msg) => {
    const sendMessage = [];
    axios.defaults.headers.common['Cookie'] = cookie;
    axios.post(checkinURL)
      .then(function (res) {
        sendMessage.push(emailStr + res.data.msg);
        console.log(emailStr + res.data.msg);
        msg(sendMessage.join(','));
      })
      .catch(function (error) {
        console.log("错误信息:" + error);
      })
  })
}

!(async () => {
  const ikuuuUserArray = await getEmailAndPassword();
  for (user of ikuuuUserArray) {
    const eamil = await user.value.split('&')[0];
    const password = await user.value.split('&')[1];
    const cookieStr = await getCookies(eamil, password);
    const msg = await signIn(eamil, cookieStr);
    allMessage.push(msg);
  }
  notify.sendNotify(`ikuuu签到`, allMessage.join('\n'))
})()
