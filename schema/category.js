const joi = require('joi');

// 定义 标题、分类Id、内容、发布状态的验证规则
const title = joi.string().required()
const categoryId = joi.number()
// 验证规则对象 - 发布文章
exports.get_category_schema = {
  body: {
    categoryId
  }
}