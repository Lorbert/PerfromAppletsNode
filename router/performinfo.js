const express = require('express');
const router = express.Router();

// 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')
 
// 导入文章的处理函数模块
const performinfo_handler = require('../router_handler/performinfo')

// 导入验证规则的处理函数
const { get_perform_schema, get_detail_schema, update_likes_schema, get_detail_recommend_schema,search_name_schema } = require('../schema/performinfo')

router.post('/information',expressJoi(get_perform_schema),performinfo_handler.getInformations)
router.get('/detail/:performanceId',expressJoi(get_detail_schema),performinfo_handler.getDetailById)
router.post('/detail/recommend',expressJoi(get_detail_recommend_schema),performinfo_handler.getInfoBycategoryId)
router.post('/detail/userlikes',expressJoi(update_likes_schema),performinfo_handler.updateLikes)
router.post('/search',expressJoi(search_name_schema),performinfo_handler.searchPerform)
// router.post('/addcates',expressJoi(add_cate_schema),performinfo_handler.addArticleCates)

// router.get('/deletecates/:id',expressJoi(delete_cate_schema), performinfo_handler.deleteCateById)

// router.get('/getcates/:id',expressJoi(delete_cate_schema), performinfo_handler.getCateById)

// router.post('/updatecates',expressJoi(update_cate_schema), performinfo_handler.updateCateById)


module.exports = router