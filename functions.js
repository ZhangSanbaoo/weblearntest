const fs = require("fs");
const bcrypt = require("bcrypt");

function myAsyncAuthorizer(usernameToFind, passwordToCheck, cb) {
  fs.readFile("./users.csv", "utf8", (error, csvData) => {
    if (error) {
      console.error("error when reading csv file", error);
      return;
    }
    const rows = csvData.split("\n");

    for (let i = 1; i < rows.length; i++) {
      const [username, password] = rows[i].split(",");
      console.log([username]);
      if (username.trim() === usernameToFind) {
        if (bcrypt.compare(passwordToCheck, password, cb) === true) {
          console.log("correct");
          return cb(null, true);
        }
      } else {
        console.log("not correct username");
        if (i >= rows.length - 1) {
          console.log(
            "Access denied, user doesn't exist or password not correct"
          );
          return cb(null, false);
        }
      }
    }
  });
}

function requireLogin(req, res, next) {
  // 检查用户是否已经通过身份验证
  if (req.session && req.session.user) {
    // 用户已登录，继续处理下一个请求处理程序
    next();
  } else {
    // 用户未登录，重定向到登录页面或返回错误信息
    res.redirect("/");
  }
}

module.exports = { myAsyncAuthorizer, requireLogin }