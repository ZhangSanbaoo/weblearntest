const fs = require("fs");

function getStudentsFromCsvfile(callback) {
    const rowSeparator = "\n";
    const cellSeparator = ",";
    fs.readFile("./student.csv", "utf8", (err, data) => {
    if (err) {
        callback(err);
        return;
    }
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
    callback(null, students);
    });
}

function addStudentToCsvFile(student, callback) {
    const csvLine = `\n${student.name},${student.school}`;
    fs.writeFile("./student.csv", csvLine, { flag: "a" }, (err) => {
    if (err) {
        callback(err);
        return;
    }
    callback(null);
    });
}

module.exports = {
    getStudentsFromCsvfile,
    addStudentToCsvFile,
};
