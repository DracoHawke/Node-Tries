const _query = require('./query');

// fetch multiple rows in once
async function fetchAll(connection, query, params){

    // execute query
    const [result] = await _query(connection, query, params);

    // entry found ?
    return result || [];
}

module.exports = fetchAll;