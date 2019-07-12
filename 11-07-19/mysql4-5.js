var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'practice1',
    debug    :  false
});
// add rows in the table
function addRow(data) {
    let insertQuery = 'INSERT INTO ?? VALUES (?,?,?,?,?,?,?,?,?)';
    let values = [["shahid","Khan","shahidkhan1232@gmail.com","palace number 3","Other","Computer_Science","Baseball","$2y$10$jSTB0rXUQcd9MymEArKWSOSoE41Dl4avnycAqbjqoQ3...","Uploads/Default.jpeg"],["shahida","Singla","shahidasingla1232@gmail.com","palace number 4","Female","Computer_Science","Football","$2y$10$jSTB0rXUQcd9MymEArKWSOSoE41Dl4avnycAqbjqoQ3...","Uploads/Default.jpeg"]]; // each array is one row
    let query = mysql.format(insertQuery,["emails",values]);
    let insertQuery = 'INSERT INTO ?? VALUES (?,?,?,?,?,?,?,?,?,?)';
    let query = mysql.format(insertQuery,["emails",data.sno,data.fname,data.lname,data.email,data.address,data.gender,data.subjects,data.sports,data.password,data.path1]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        console.log(response.insertId);
    });
}
// timeout just to avoid firing query before connection happens
setTimeout(() => {
    addRow({
        "sno": 1,
        "fname": "Shahid",
        "lname": "Kapoor",
        "email": "shahidkapoor1232@gmail.com",
        "address": "palace number 2",
        "gender" : "Male",
        "subjects": "Math",
        "sports": "Baseball",
        "password": "$2y$10$jSTB0rXUQcd9MymEArKWSOSoE41Dl4avnycAqbjqoQ3...",
        "path1": "Uploads/Default.jpeg"
    });
},5000);
