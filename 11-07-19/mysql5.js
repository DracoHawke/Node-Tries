var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'practice1',
    debug    :  false
});
// query rows in the table
function queryRow(userName) {
    let selectQuery = 'SELECT * FROM ?? WHERE ?? = ?';
    let query = mysql.format(selectQuery,["emails","First_Name", userName]);
    // query = SELECT * FROM `emails` where `First_Name` = 'shahid'
    pool.query(query,(err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        // rows fetch
        console.log(data);
    });
}
setTimeout(() => {
    queryRow('shahid');
},5000);

let insertQuery = 'INSERT INTO ?? (??,??) VALUES (?,?)';
    let values = [["shahid","hello"],["Rohit","Hi"]]; // each array is one row
    let query = mysql.format(insertQuery,["todo","user","notes",values]);
