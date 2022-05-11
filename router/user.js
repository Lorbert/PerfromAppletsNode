// 导入 express 模块
const express = require('express');
const router = express.Router()

// 导入用户路由处理函数对应的模块
const user_handler = require('../router_handler/user')

// 1.导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 2.导入需要的验证规则对象
const { reg_login_schema,reg_email_schema,reg_reguser_schema,reg_forget_schema } = require('../schema/user')

//注册新用户
router.post('/reguser', expressJoi(reg_reguser_schema), user_handler.regUser)
//登录
router.post('/login',expressJoi(reg_login_schema), user_handler.login)
//发送邮箱验证码
router.post('/sendmail',expressJoi(reg_email_schema), user_handler.sendmail)
//忘记密码
router.post('/forgetpassword',expressJoi(reg_forget_schema), user_handler.forgetPassword)
module.exports = router