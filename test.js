const fs = require("fs");
function authenticateAndAuthorize(username, password, id) {
    const studentData = fs.readFileSync('studentdetail.csv', 'utf8');
    const rows = studentData.split('\n').slice(1);
    for (let row of rows) {
      const [userID, user, pass] = row.split(',');
      console.log(userID,user,pass)
      if (user === username && pass === password && userID === id) {
        console.log('user correct')
      }
      if (user === username && pass === password && userID === id) {
        return true;
      }
    }
    return false;
  }
const username = 'admin'
const password = 'admin'
const id = '1'
const test = authenticateAndAuthorize(username, password, id)
console.log(test)