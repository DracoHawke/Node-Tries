const _query = require('./query');

// insert data
async function insert(connection, table, data){

    // execute query
    const [result] = await _query(connection, 'INSERT INTO ?? SET ?', [table, data]);

    // return id + result
    return [result.insertId || null, result];
}

module.exports = insert;