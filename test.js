const fs = require("fs");
function authenticateAndAuthorize(username, password, id) {
  fetch("studentdetail.csv")
    .then((response) => response.text())
    .then((studentData) => {
      const rows = studentData.split("\n").slice(1);
      for (let row of rows) {
        const [userID, user, pass] = row.split(",");
        console.log(userID, user, pass);
        if (
          user === username &&
          pass === password &&
          userID === id.toString()
        ) {
          return true;
        }
      }
      return false;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}
const username = 'admin'
const password = 'admin23432'
const id = '1'
const test = authenticateAndAuthorize(username, password, id)
console.log(test)