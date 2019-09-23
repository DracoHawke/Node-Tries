const _mysql = require('mysql');
const _poolConnection = require('./pool-connection');

// cached pools
const _pools = {};

// create new pool
function initPool(name, config){
    // new pool
    const pool = _mysql.createPool(config);

    // create pool wrapper
    _pools[name || '_default'] = {
        _instance: pool,
        getConnection: function(scope){
            return _poolConnection.getConnection(pool, scope);
        }
    }
}

// get an existing pool
function getPool(name='_default'){
    // pool exists ?
    if (name in _pools){
        return _pools[name];
    }else{
        throw new Error('Unknown pool <' + name + '> requested');
    }
}

module.exports = {
    initPool: initPool,
    getPool: getPool
};