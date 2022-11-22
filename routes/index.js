var express = require('express');
var router = express.Router();
var mysql = require('mysql');
let alert = require('alert');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'main_project'
});

connection.connect(function (err) {
  if (!err) {
    console.log("Database Connection Successfully");
  }
  else {
    console.log("Database Connection Error");
  }
});

/* GET home page. */
// User Login System
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register',function(req, res, next){
  res.render('register');
});

router.post('/register_process',function(req, res, next){
  const mydata = {
    user_name : req.body.name,
    user_email : req.body.email,
    user_password : req.body.password,
  }
  connection.query("insert into tbl_user set ?",mydata,function(err, result){
    if(err) throw err;
    res.redirect('/login');
  })
});


router.get('/login', function (req, res, next) {
  res.render('login')
});

router.post('/login_process', function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  connection.query("select * from tbl_user where user_email = ? and user_password = ?", [email, password], function (err, rows) {
    if (err) {
      res.send("error")
    }
    else {
      if (rows.length > 0) {
        var username = rows[0].user_name;
        var useremail = rows[0].user_email;
        var userid = rows[0].user_id;

        req.session.username = username;
        req.session.userid = userid;
        req.session.useremail = useremail;

        console.log(req.session.username);
        console.log(req.session.userid);
        console.log(req.session.useremail);
        res.redirect('dashboard')
      }
      else {
        res.send("login failed");
      }
    }
  })
});

router.get('/dashboard', function (req, res, next) {

  if(req.session.userid){
    connection.query("select * from tbl_product",function(err, rows){
      if(err) throw err;
      console.log(rows);
      res.render('dashboard',{rows_array:rows})
    });
  }
  else{
    res.redirect('/login')
  }
});

router.get('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    res.redirect('/login');
  });
});


// Admin Login System

router.get('/admin_login',function(req, res, next){
  res.render('admin_login');
});

router.post('/admin_login_process', function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  connection.query("select * from tbl_admin where admin_email = ? and admin_password = ?", [email, password], function (err, rows) {
    if (err) {
      res.send("error")
    }
    else {
      if (rows.length > 0) {
        var adminname = rows[0].admin_name;
        var adminemail = rows[0].admin_email;
        var adminid = rows[0].admin_id;

        req.session.adminname = adminname;
        req.session.adminid = adminid;
        req.session.adminemail = adminemail;

        console.log(req.session.adminname);
        console.log(req.session.adminid);
        console.log(req.session.adminemail);
        res.redirect('admin_dashboard')
      }
      else {
        res.send('Login Failed');
      }
    }
  })
});

router.get('/admin_dashboard', function (req, res, next) {

  if (req.session.adminname) {
    var adminname = req.session.adminname;
    res.render('admin_dashboard', { myvalue: adminname })
  }
  else {
    res.redirect('/admin_login')
  }
});

router.get('/admin_logout', function (req, res, next) {
  req.session.destroy(function (err) {
    res.redirect('/admin_login');
  });
});

// Add Product

router.get('/add_product', function(req, res, next){
  if(req.session.adminid){
    res.render('add_product');
  }
  else{
    res.redirect('/admin_login')
  }
});

router.post('/add_product_system',function(req ,res, next){
  console.log(req.body);
  const mydata = {
    product_name : req.body.pname,
    product_price : req.body.pprice,
    product_details : req.body.pdetails,
    product_image : req.body.pimage
  }
  connection.query("insert into tbl_product set ?",mydata,function(err, result){
    if(err) throw err;
    res.redirect('/add_product')
  });
});

router.get('/view_product',function(req, res, next){
  if(req.session.adminid){
    connection.query("select * from tbl_product",function(err, rows){
      if(err) throw err;
      console.log(rows);
      res.render('view_product',{rows_array:rows})
    });
  }
  else{
    res.redirect('/admin_login')
  }
});


router.get('/admin_logout', function (req, res, next) {
  req.session.destroy(function (err) {
    res.redirect('/admin_login');
  });
});


module.exports = router;