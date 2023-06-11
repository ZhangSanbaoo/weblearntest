const express = require("express");
const path = require("path");
const os = require("os");
const { studentRouter } = require("./api");
const app = express();
const port = 3000;
const { getStudentsFromCsvfile, addStudentToCsvFile, updateStudentInCsvFile } = require("./csv");
const fs = require("fs");
const basicAuth = require("express-basic-auth");
var cookieParser = require("cookie-parser");
const { myAsyncAuthorizer, requireLogin, authenticateAndAuthorize } = require("./functions");
const session = require('express-session');
const bodyParser = require('body-parser');
const prompt = require("prompt-sync")({ sigint: true });

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//route that demand login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});

// login request, if valid then go to home page, else fresh the login page with a alert
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

//basic home page
app.get('/home', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'views/home.html'));
});

//students page which made on tp2
app.get("/students", (req, res) => {
  getStudentsFromCsvfile((err, students) => {
    if (err) {
      console.error(err);
      res.send("ERROR");
    }
    res.render("students", { students });
  });
});

//post request to create an student, when done will refresh the page
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

//students data page which display 2 charts
app.get("/students/data", (req, res) => {
  res.render("students_data");
});

//students create page where you can input new student's information and add into the csv file
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

// app.get('/students/:id', function(req, res) {
//   const fakeStudent = {
//     name: "FakeStudent",
//     school: "FakeSchool"
//   };
//   res.render('student_details', { student: fakeStudent });
// });

//student's personal page, id here is the index of that student in csv file
//this site contains an update information function.
app.get('/students/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  getStudentsFromCsvfile((err, students) => {
    if (err) {
      return res.status(500).send(err.message);
    };
    const student = students[id - 1];
    if (student) {
      return res.render('student_verify', { student, id });
    } else {
      return res.send("<script>alert('Invalid Student\\'s ID'); window.location.href='/students';</script>");
    }
  });
});

//this is to help the authentication to each student's personal file
app.get('/students/verify/:id', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  const id = req.params.id;

  const isAuthenticated = authenticateAndAuthorize(username, password, id);
  console.log(isAuthenticated);
  if (isAuthenticated === true) {

    getStudentsFromCsvfile((err, students) => {
      if (err) {
        return res.status(500).send(err.message);
      };
      const student = students[id - 1];
      return res.render('student_details', { student, id }); // 
    });
  } else {

    return res.send("<script>alert('Access denied, user doesn\\'t exist or password not correct'); window.location.href='/students';</script>");
  }
});

//here is where we process data from student's personal page to update student's information.
app.post('/students/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const csvLine = `\n${req.body.name},${req.body.school}`;
  console.log(csvLine);
  updateStudentInCsvFile(id - 1, csvLine, (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.redirect('/students/' + id);
    }
  });
});

//same as post but use put method
app.put('/api/students/:id/update', (req, res) => {
  const updatedStudent = `${req.body.name},${req.body.school}`;
  const id = req.params.id;
  updateStudentInCsvFile(id - 1, updatedStudent, err => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ success: true });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
