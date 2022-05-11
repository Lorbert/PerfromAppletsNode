// 导入 express 模块
const express = require('express');
// 创建 express 的服务器实例
const app = express()
const joi = require('joi')

// 允许跨域资源共享
const cors = require('cors')
app.use(cors())

//解析 post 表单数据的中间件，只能解析xxx表单的中间件
app.use(express.urlencoded({ extended: false }))

// 一定要在路由之前，封装res.cc函数
app.use((req,res,next) => {
  //status值为0表示成功，1表示失败。默认值为1
  //err的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = (err,status=1,code=404) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
      code
    })
  }
  next()
})

//一定要在路由配置之前配置解析 Token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')

app.use(expressJWT({secret: config.jwtSecretKey}).unless({path: [/^\/api/]}))

//导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api',userRouter)

//导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my',userinfoRouter)

//导入并使用文章分类列表的路由模块
const performinfoRouter = require('./router/performinfo')
app.use('/perform',performinfoRouter)

//导入并使用文章的路由模块
const articleRouter = require('./router/category')
app.use('/category',articleRouter)

//定义错误级别的中间件
app.use((err,req,res,next) => {
  //验证失败导致的错误
  if(err instanceof joi.ValidationError) return res.cc(err)
  //身份认证失败后的错误
  if(err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  //未知的错误
  res.cc(err)
})

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

//启动服务器
app.listen('3007',() => {
  console.log('api server running 3007');
})