const _query = require('./query');

// fetch a single row and handle errors
async function fetchRow(connection, query, params){

    // execute query
    const [result] = await _query(connection, query, params);

    // entry found ?
    if (result.length >= 1){
        // extract data
        return result[0];
    }else{
        return null;
    }
}

module.exports = fetchRow;