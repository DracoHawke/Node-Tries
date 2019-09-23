const _fetchRow = require('./fetch-row');
const _fetchAll = require('./fetch-all');
const _insert = require('./insert');
const _query = require('./query');

// expose async api wrapper
function exposeAPI(connection){
    return {

        query: function(stmt, params){
            return _query(connection, stmt, params);
        },

        insert: function(table, data){
            return _insert(connection, table, data);
        },

        fetchRow: function(stmt, params){
            return  _fetchRow(connection, stmt, params);
        },

        fetchAll: function(stmt, params){
            return _fetchAll(connection, stmt, params);
        },

        release: function(){
            return connection.release();
        }
    };
}

// promise wrapper
function getConnection(pool, scope){
    return new Promise(function(resolve, reject){

        // try to get a new connection from current pool
        pool.getConnection(function(err, connection){
            // connection available ?
            if (err){
                reject(err);
                return;
            }

            // API Wrapper
            const api = exposeAPI(connection);

            // execute within scope ?
            if (typeof scope === 'function'){

                // execute async scopee
                scope.apply(api, [api, connection]).then(function(result){

                    // close connection
                    connection.release();

                    // success
                    resolve(result);
                }).catch(function(e){
                    // close connection
                    connection.release();

                    // reject
                    reject(e);
                });

            }else{
                // return connection API
                resolve(api);
            }
        });
    });
}

module.exports = {
    getConnection: getConnection,
};