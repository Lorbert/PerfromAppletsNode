// 导入定义验证规则的模块
const joi = require('joi')

//定义 分类名称 和 分类别名 的校验规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()
const id = joi.number().integer().min(1).required()
const code = joi.string().required()
const performanceId = joi.number().required()
const categoryId = joi.number().required()
const likes = joi.number()

exports.get_perform_schema = {
  body: {
    code
  }
}
exports.get_detail_schema = {
  params: {
    performanceId
  }
}
exports.update_cate_schema = {
  body: {
    Id:id,
    name,
    alias
  }
}
exports.get_detail_recommend_schema = {
  body: {
    performanceId,
    categoryId
  }
}

exports.update_likes_schema = {
  body: {
    likes,
    performanceId
  }
}

exports.search_name_schema = {
  body: {
    name
  }
}