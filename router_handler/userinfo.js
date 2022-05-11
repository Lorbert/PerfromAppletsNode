//导入数据库操作模块
const db = require('../db/index')
// 在头部区域导入 bcryptjs 后，
// 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
// compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
const bcrypt = require('bcryptjs')

//获取用户信息的处理函数
exports.getUserinfo = (req,res) => {
  //根据用户的id，查询用户的基本信息
  //注意：要防止密码泄露
  const sql = `select id, username, email, user_pic, user_likes, user_interesting, user_seen from  ev_users where id=?`

  // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我  们挂载上去的
  db.query(sql, req.user.id, (err, results) => {
    // 执行SQL语句失败
    if(err) return res.cc(err);

    // 执行SQL语句成功，但是查询的结果可能为空
    if(results.length !== 1) return res.cc('获取用户信息失败！')

    //将用户信息响应给客户端
    res.send({
      status: 0,
      data: results[0],
    })

  })
}
//更新用户信息和修改
exports.updateUserInfo = (req,res) => {
  const sql = `update ev_users set ? where id=? `
  db.query(sql, [req.body, req.user.id], (err, results) => {
    // 执行SQL语句失败
    if(err) return res.cc(err);

    // 执行 SQL 语句成功，但影响行数不为 1
    if(results.affectedRows !== 1) return res.cc('获取用户信息失败！')

    //修改用户信息成功
    return res.cc('修改用户信息成功',0)
  })
}
//更新用户兴趣爱好
exports.updateInterest = (req,res) => {
  const sql = `update ev_users set user_interesting=? where id=? `
  db.query(sql, [req.body.interest, req.user.id], (err, results) => {
    // 执行SQL语句失败
    if(err) return res.cc(err);

    // 执行 SQL 语句成功，但影响行数不为 1
    if(results.affectedRows !== 1) return res.cc('获取用户信息失败！')

    //修改用户信息成功
    return res.cc('添加兴趣成功',0,200)
  })
}
//更新密码
exports.updatePassword = (req,res) => {
  const sql = `select * from ev_users where id=?`;
  db.query(sql, req.user.id, (err,results) => {
    // 执行SQL语句失败
    if(err) return res.cc(err);

    // 执行SQL语句成功，但是查询的结果可能为空
    if(results.length !== 1) return res.cc('获取用户信息失败！')

    // 判断密码是否正确
    const compareResults = bcrypt.compareSync(req.body.oldPwd, results[0].password);
    if(!compareResults) return res.cc('原密码错误！')
    

    // 定义更新密码的SQL语句
    const sql = `update ev_users set password=? where id=?`;
    const newPwd = bcrypt.hashSync(req.body.newPwd,10)
    db.query(sql,[newPwd, req.user.id], (err,results) => {
      // 执行SQL语句失败
      if(err) return res.cc(err);

      // 执行 SQL 语句成功，但影响行数不为 1
      if(results.affectedRows !== 1) return res.cc('更新密码失败！')

      res.cc('更新密码成功',0)
    })

  })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req,res) => {
  const sql = `update ev_users set user_pic=? where id=?`;
  db.query(sql,[req.body.avatar,req.user.id],(err,results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)

    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc('更新头像失败！')

    // 更新用户头像成功
    return res.cc('更新头像成功！', 0)
  })
}
// 更新用户收藏的演出
exports.updateLikes = (req,res) => {
  const sql = `select * from ev_users where id=?`;
  db.query(sql, req.user.id, (err,results) => {
    // 执行SQL语句失败
    if(err) return res.cc(err);

    // 执行SQL语句成功，但是查询的结果可能为空
    if(results.length !== 1) return res.cc('获取用户信息失败！')
    
    const sqlStr = `update ev_users set user_likes=? where id=?`
    db.query(sqlStr,[req.body.likes,req.user.id],(errs,ress) => {
      // 执行SQL语句失败
      if(errs) return res.cc(errs);
      res.send({
        status:0
      })
    })
  })
}
//更新用户看过的演出
exports.updateSeen = (req,res) => {
  const sql = `select * from ev_users where id=?`;
  db.query(sql, req.user.id, (err,results) => {
    // 执行SQL语句失败
    if(err) return res.cc(err);

    // 执行SQL语句成功，但是查询的结果可能为空
    if(results.length !== 1) return res.cc('获取用户信息失败！')
    
    const sqlStr = `update ev_users set user_seen=? where id=?`
    db.query(sqlStr,[req.body.likes,req.user.id],(errs,ress) => {
      // 执行SQL语句失败
      if(err) return res.cc(err);
      // 执行 SQL 语句成功，但影响行数不为 1
      res.send({
        status:0
      })
    })
  })
}
exports.getUserlike =(req,res) => {
  const sql = `select * from pf_information_total where ticketStatus=1 and performanceId in (?) `
  const likes = req.user.user_likes.split(',')
  likes.splice(0,1)
  console.log(likes,'用户收藏');
  db.query(sql,[likes],(err,results) => {
    if(err) return res.cc(err)
    console.log(results.length);
    return res.send({
      status:0,
      data:results,
      code:200
    })
  })
}
exports.getUserseen =(req,res) => {
  const sql = `select * from pf_information_total where ticketStatus=1 and performanceId in (?) `
  const likes = req.user.user_seen.split(',')
  likes.splice(0,1)
  console.log(likes,'用户看过');
  db.query(sql,[likes],(err,results) => {
    if(err) return res.cc(err)
    console.log(results.length);
    return res.send({
      status:0,
      data:results,
      code:200
    })
  })
}