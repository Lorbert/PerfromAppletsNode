//导入数据库操作模块
const db = require('../db/index')
//导入bcrypt.js这个包
const bcrypt = require('bcryptjs')
//导入生成TOKEN的包
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')

//验证码
const nodeMail =  require('../nodemailer.js')
const codes =  String(Math.floor(Math.random() * 1000000)).padEnd(6, '0');
//发送验证码
exports.sendmail = (req,res) => {
  const email = req.body.email;
  //定义 SQL 语句，查询邮箱是否被占用
  const sqlStr = 'select * from ev_users where email=?';
  // 验证码的格式
  const code = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0') //生成6位随机验证码
  this.codes = code;
  const mail = {
    from: `"演出小程序"<m13437627544@163.com>`,// 发件人
    subject: '验证码',//邮箱主题
    to: email,//收件人，这里由post请求传递过来
    // 邮件内容，用html格式编写
    html: `
        <p>您好！</p>
        <p>您的验证码是：<strong style="color:orangered;">${code}</strong></p>
        <p>如果不是您本人操作，请无视此邮件</p>
        <p>为了保证您帐号的安全性，该验证码有效期为5分钟</p>
    ` 
  };
  db.query(sqlStr,email,(err,results) => {
    //执行SQL语句失败
    if(err) {
      // return res.send({status:1,message: err.message})
      return res.cc('邮箱不合法')
    }
    //邮箱可以使用
    nodeMail.sendMail(mail, (errs, info) => {
      if (!errs) {
          res.cc("验证码发送成功",0)
          setTimeout(()=> {
            this.codes = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0')
          },3000000)
      } else {
          res.cc("验证码发送失败，请稍后重试")
      }
    })
  })
}
//注册新用户的处理函数
exports.regUser = (req,res) => {
  const userinfo = req.body;
  console.log(userinfo);
  //对表单中的数据进行合法性的验证
  // if(!userinfo.username || !userinfo.password) {
  //   return res.cc(err)
  // }

  //定义 SQL 语句，查询邮箱是否被占用
  const sqlStr = 'select * from ev_users where email=?';
  db.query(sqlStr,userinfo.email,(err,results) => {
    //执行SQL语句失败
    if(err) {
      // return res.send({status:1,message: err.message})
      return res.cc('邮箱或密码不合法')
    }
    //判断邮箱是否被占用
    if(results.length > 0) {
      console.log(results);
      // return res.send({ status: 1,message:'该用户名已存在！'})
      return res.cc('该邮箱用户已存在！')
    }
    if(userinfo.mail != this.codes) {
      return res.cc('验证码错误！')
    }
    //调用 bcrypt.hashSync() 对密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);
    //定义插入新用户的SQL语句
    const sql = 'insert into ev_users set ?'
    //调用 db.query() 执行 SQL 语句
    db.query(sql, {email:userinfo.email,password:userinfo.password,username:userinfo.username},(err,results) => {
      //判断SQL语句是否执行成功
      if(err) return res.cc(err)
      //判断影响行数是否为1
      if(results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
      const sqls = `select * from ev_users where email=?`
      //执行SQL语句，根据用户名查询用户的信息
      db.query(sqls,userinfo.email,(err,results) => {
        //执行SQL语句失败
        if(err) return res.cc(err)
        //生成JWT的Token字符串
        const user = { ...results[0],password:'',user_pic:''}
        //对用户的信息进行加密，生成Token字符串
        const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn:'10h'})
        //调用res.send（）将token响应给客户端
        res.send({
          status: 0,
          message:'注册成功',
          token: 'Bearer ' +tokenStr,
          code:200
        })
      })
    })
  })
}
// 用户忘记密码
exports.forgetPassword = (req,res) => {
  const userinfo = req.body;
  //定义 SQL 语句，查询邮箱是否被占用
  const sqlStr = 'select * from ev_users where email=?';
  db.query(sqlStr,userinfo.email,(err,results) => {
    //执行SQL语句失败
    if(err) {
      // return res.send({status:1,message: err.message})
      return res.cc('邮箱或密码不合法')
    }
    if(userinfo.mail != this.codes) {
      return res.cc('验证码错误！')
    }
    //调用 bcrypt.hashSync() 对密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);
    //定义插入新用户的SQL语句
    const sql = 'update ev_users set password=? where email = ?';
    db.query(sql,[userinfo.password,userinfo.email],(err, results) => {
      // 执行SQL语句失败
      if(err) return res.cc(err);
  
      // 执行 SQL 语句成功，但影响行数不为 1
      if(results.affectedRows !== 1) return res.cc('更新密码失败！')
  
      //修改用户信息成功
      return res.cc('修改密码成功',0,200)
    })
  })
}
// 用户登录的处理函数
exports.login = (req,res) => {
  const userinfo = req.body;
  //定义SQL语句
  const sql = `select * from ev_users where email=?`
  //执行SQL语句，根据用户名查询用户的信息
  db.query(sql,userinfo.email,(err,results) => {
    //执行SQL语句失败
    if(err) return res.cc(err)
    //执行SQL语句成功，但是获取到的数据条数不等于1
    if(results.length !== 1) return res.cc('登陆失败！')

    // 判断密码是否正确
    const compareResults = bcrypt.compareSync(userinfo.password,results[0].password)
    if(!compareResults) return res.cc('登录失败！')
    console.log(results)
    //生成JWT的Token字符串
    const user = { ...results[0],password:'',user_pic:''}
    //对用户的信息进行加密，生成Token字符串
    const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn:'10h'})
    //调用res.send（）将token响应给客户端
    res.send({
      status: 0,
      message:'登录成功',
      token: 'Bearer ' +tokenStr,
      code:200
    })
  })
}