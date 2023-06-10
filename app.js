const express = require("express");
const path = require("path");
const os = require("os");
const { studentRouter } = require("./api");
const app = express();
const port = 3000;
const { getStudentsFromCsvfile, addStudentToCsvFile } = require("./csv");
const fs = require("fs");
const basicAuth = require("express-basic-auth");
var cookieParser = require("cookie-parser");
const { myAsyncAuthorizer, requireLogin } = require("./functions");
const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));
app.use(express.urlencoded({ extended: true }));
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/api/students", studentRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.post('/login', (req, res) => {
  myAsyncAuthorizer(req.body.Username, req.body.Password, (error, result) => {
    if (error) {
      console.error('Error:', error);
      return res.redirect("/");
    }
    if (result === true) {
      req.session.user = req.body.Username;
      return res.redirect("/home");
    } else {
      return res.send("<script>alert('Access denied, user doesn\\'t exist or password not correct'); window.location.href='/';</script>");
    }
  });
});

app.get('/home', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'views/home.html'));
});

app.get("/students", (req, res) => {
  getStudentsFromCsvfile((err, students) => {
    if (err) {
      console.error(err);
      res.send("ERROR");
    }
    res.render("students", { students });
  });
});

app.post("/students/create", (req, res) => {
  console.log(req.body);
  const csvLine = `\n${req.body.Name},${req.body.School}`;
  const stream = fs.writeFile(
    "./student.csv",
    csvLine,
    { flag: "a" },
    (err) => {
      res.redirect("/students/create?created=1");
    }
  );
});

app.get("/students-csv-parsed", (req, res) => {
  const rowSeparator = "\n";
  const cellSeparator = ",";
  fs.readFile("./student.csv", "utf8", (err, data) => {
    const rows = data.split(rowSeparator);
    const [headerRow, ...contentRows] = rows;
    const header = headerRow.split(cellSeparator);
    const students = contentRows.map((row) => {
      const cells = row.split(cellSeparator);
      const student = {
        [header[0]]: cells[0],
        [header[1]]: cells[1],
      };
      return student;
    });
    res.send(students);
  });
});

app.get("/students/data", (req, res) => {
  res.render("students_data");
});

app.get("/students/create", (req, res) => {
  res.render("create-student");
});

app.post("/api/login", (req, res) => {
  const token = "FOOBAR";
  const tokenCookie = {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000),
  };
  res.cookie("auth-token", token, tokenCookie);
  res.json({ message: "Login successful" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
