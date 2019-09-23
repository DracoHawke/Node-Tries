// promisified query
function query(connection, ...params){
    return new Promise(function(resolve, reject){
        // execute query
        connection.query(...params, function(err, result, fields){
            if (err){
                reject(err);
            }else{
                resolve([result, fields]);
            }
        });
    });
}

module.exports = query;