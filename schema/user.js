//导入定义验证规则的包
const joi = require('joi')

//定义用户名和密码的验证规则
const username = joi.string().required();
const password = joi.string().pattern(/^[\S]{6,12}$/).required();

//定义id，nickname，email 的验证规则
const id = joi.number().integer().min(1).required();
const nickname = joi.string().required();
const email = joi.string().email().required();
const mail = joi.number().required();
// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required();
const interest = joi.string().required();
const likes = joi.string()

//定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
  body: {
    email,
    password
  },
}
//定义注册验证的规则对象
exports.reg_reguser_schema = {
  body: {
    email,
    password,
    mail,
    username
  }
}

//发送验证码，邮箱验证
exports.reg_email_schema = {
  body: {
    email
  }
}
// 更新用户基本信息的验证规则对象
exports.update_userinfo_schema = {
  body: {
    username,
  }
}
// 更新用户兴趣的验证规则对象
exports.update_interest_schema = {
  body: {
    interest,
  }
}
// 忘记密码的更改的验证规则对象
exports.reg_forget_schema = {
  body: {
    email,
    password,
    mail
  }
}
// 更新密码的验证规则对象
exports.update_password_schema = {
  body: {
    oldPwd: password,
    // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
    // 解读：
    // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
    // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
    // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
    newPwd: joi.not(joi.ref('oldPwd')).concat(password),
  }
}

// 更新头像的验证规则对象
exports.update_avatar_schema = {
  body: {
    avatar,
  }
}

// 更新用户收藏的验证规则对象
exports.update_likes_schema = {
  body: {
    likes
  }
}