const express = require("express");
const router = express.Router();
const { getStudentsFromCsvfile, addStudentToCsvFile } = require("./csv");

router.get("/", (req, res) => {
    getStudentsFromCsvfile((err, students) => {
    if (err) {
        console.error(err);
        res.send("ERROR");
    }
    res.render("students", { students });
    });
});

router.get("/csv", (req, res) => {
    res.download("./student.csv");
});

router.post("/", (req, res) => {
    addStudentToCsvFile(req.body, (err) => {
    if (err) {
        console.error(err);
        res.send("ERROR");
    } else {
        res.redirect("/api/students?created=1");
    }
    });
});

module.exports = {
    studentRouter: router,
};
