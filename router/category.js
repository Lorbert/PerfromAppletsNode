const express = require('express');
const router = express.Router();

// 导入解析 formdata 格式表单数据的包
// const multer = require('multer')
// 导入处理路径的核心模块
// const path = require('path')

// 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')

// 创建multer 的实例对象，通过 dest 属性指定文件的存放路径
// const upload = multer({dest: path.join(__dirname,'../uploads') })

const category_handler = require('../router_handler/category')

// 导入文章的验证模块
const { get_category_schema, } = require('../schema/category')


//发布文章的路由
router.get('/getcatename',category_handler.getCategory)
router.post('/getperformance',expressJoi(get_category_schema),category_handler.getPerformance)

module.exports = router