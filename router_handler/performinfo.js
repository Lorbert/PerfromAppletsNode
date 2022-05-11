//导入数据库操作模块
const { callbackPromise } = require('nodemailer/lib/shared');
const db = require('../db/index')

// 获取文章分类的信息
exports.getInformations = (req,res) => {
  // 根据分类的状态，获取所有未被删除的分类列表数据
  // ticketStatus 为 1 表示没有被 标记为删除 的数据
  const sql = `select pf_information_total.*,pf_information_cate.cateName from pf_information_total join pf_information_cate on pf_information_total.categoryId=pf_information_cate.categoryId and pf_information_total.ticketStatus=1 and pf_information_total.code=? order by pf_information_total.id asc `;
  db.query(sql,req.body.code,(err,results) => {
    // 执行SQL语句失败
    if(err) return res.cc(err);
    if(results.length < 20) {
      const code = req.body.code.toString().split('');
      code.splice(2,2,0,0)
      const sqlStr = `select pf_information_total.*,pf_information_cate.cateName from pf_information_total join pf_information_cate on pf_information_total.categoryId=pf_information_cate.categoryId and pf_information_total.ticketStatus=1 and pf_information_total.parentsCode=? and pf_information_total.code!=? order by pf_information_total.id asc `;
      db.query(sqlStr,[code.join(''),req.body.code],(errs,ress) => {
        // 执行SQL语句失败
        if(errs) return res.cc(errs);
        results = results.concat(ress)
        return res.send({
          status: 0,
          message: '获取演出列表成功！',
          data: results,
          code:200
        })
      })
    } else {
      res.send({
        status: 0,
        message: '获取演出列表成功！',
        data: results,
        code:200
      })
    }
  })
}
// 新增文章分类
exports.addArticleCates = (req,res) => {
  const sql = `select * from ev_article_cate where name=? or alias=?`;
  db.query(sql,[req.body.name,req.body.alias],(err,results) => {
    // 执行SQL语句失败
    if(err) return res.cc(err);

    // 判断 分类名称 和 分类别名 是否被占用
    if(results.length === 2) return res.cc('分类名与别名已被占用，请更换后重试！')
    if(results.length ===1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
    if(results.length ===1 && results[0].alias === req.body.alias) return res.cc('别名名称被占用，请更换后重试！')

    const sql = `insert into ev_article_cate set ?`;
    db.query(sql, req.body, (err,results) => {
      if(err) return res.cc(err);
      // SQL 语句执行成功，但是影响行数不等于 1
      if(results.affectedRows !== 1) return res.cc('新增文章分类失败！')

      // 新增文章分类成功
      res.cc('新增文章分类成功！', 0)
      
    })
  })
}

// 删除文章分类
exports.deleteCateById = (req,res) => {
  const sql = `update ev_article_cate set is_delete=1 where id=? `;
  db.query(sql,req.params.id, (err,results) => {
    if(err) return res.cc(err)

    if(results.affectedRows !== 1) return res.cc('删除文章分类失败！')

    res.cc('删除文章分类成功!',0)
  })
}

// 根据id查询演出详情信息
exports.getDetailById = (req,res) => {
  const sql = `select * from pf_information_total where performanceId=?`
  db.query(sql, req.params.performanceId, (err,results) => {
    if(err) return res.cc(err);
    if(results.length !==1 ) return res.cc('查询失败')
    const sqls = `select picture from pf_information_detail where performanceId=?`
    db.query(sqls, req.params.performanceId, (errs,pictureRes) => {
      if(errs) return res.cc(errs);
      results[0].pictures = pictureRes;
      res.send({
        status: 0,
        data: results[0],
        code:200
      })
    })
  })
}

// 根据分类id查询演出信息
exports.getInfoBycategoryId = (req,res) => {
  const sql = `select * from pf_information_total where performanceId!=? and ticketStatus=1 and categoryId=?`
  db.query(sql,[req.body.performanceId,req.body.categoryId],(err,results) => {
    if(err) return res.cc(err);
    if(results.length < 10) {
      const sqlStr = `select * from pf_information_total where ticketStatus=1 and categoryId in (?) and categoryId!=? `
      const interesting = req.user.user_interesting.split(',')
      console.log(interesting);
      db.query(sqlStr,[interesting,req.body.categoryId],(errs,ress) => {
        if(errs) return res.cc(errs)
        results = results.concat(ress);
        results = results.slice(0,10);
        return res.send({
          status:0,
          data:results,
          code:200
        })
      })
    } else {
      res.send({
        status:0,
        data:results,
        code:200
      })
    }
  })
}
// 根据id更新文章分类
exports.updateCateById = (req,res) => {
  const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`
  db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err,results) => {
    // 执行SQL语句失败
    if(err) return res.cc(err);

    //判断分类名称或者别名是否被占用
    if(results.length ===2 ) return res.cc('分类名称与别名被占用，请更换后重试！')
    if(results.length ===1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
    if(results.length ===1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
    const sql = `update ev_article_cate set ? where Id=?`
    db.query(sql, [req.body,req.body.Id], (err,results) => {
      if(err) return res.cc(err);
      if(results.affectedRows !== 1) return res.cc('修改文章分类失败！')
      res.cc('更新成功！',0)
    })
  })
}
exports.updateLikes = (req,res) => {
  const sql = `select * from pf_information_total where performanceId=? and ticketStatus=1`
  db.query(sql,req.body.performanceId, (err,results) => {
    // 执行SQL语句失败
    if(err) return res.cc(err);
    const sqlStr = `update pf_information_total set likes=? where performanceId=?`
    db.query(sqlStr,[req.body.likes,req.body.performanceId],(errs,ress) => {
      // 执行SQL语句失败
      if(errs) return res.cc(errs);
      res.send({
        status:0
      })
    })
  })
}
exports.searchPerform = (req,res) => {
  const sql = `select * from pf_information_total where name like ? or shopName like ? and ticketStatus=1`
  const name = '%'+ req.body.name + '%'
  db.query(sql,[name,name], (err,results) => {
    // 执行SQL语句失败
    if(err) return res.cc(err);
    res.send({
      status:0,
      code:200,
      data:results
    })
  })
}