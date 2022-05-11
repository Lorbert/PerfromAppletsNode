const express = require('express');
const router = express.Router();
// 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')

// 导入需要的验证规则对象
const { update_userinfo_schema, update_password_schema, update_avatar_schema,update_interest_schema, update_likes_schema} = require('../schema/user')

// 导入用户信息的处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

// 获取用户的基本信息
router.get('/userinfo',userinfo_handler.getUserinfo)

// 更新用户信息的路由
router.post('/userinfo',expressJoi(update_userinfo_schema),userinfo_handler.updateUserInfo)

// 更新密码的路由
router.post('/updatepassword',expressJoi(update_password_schema),userinfo_handler.updatePassword)

// 更新头像的路由
router.post('/update/avatar',expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)

// 更新兴趣的路由
router.post('/userinfo/interest',expressJoi(update_interest_schema),userinfo_handler.updateInterest)

// 更新用户收藏
router.post('/updatelikes',expressJoi(update_likes_schema),userinfo_handler.updateLikes)

// 用户收藏演出
router.get('/userinfo/userlike',userinfo_handler.getUserlike)

// 用户看过演出
router.get('/userinfo/userseen',userinfo_handler.getUserseen)

// 更新用户收藏
router.post('/updateseen',expressJoi(update_likes_schema),userinfo_handler.updateSeen)
module.exports = router
