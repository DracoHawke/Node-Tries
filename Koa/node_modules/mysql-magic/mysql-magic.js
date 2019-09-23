const _poolManager = require('./lib/pool-manager');
const _poolConnection = require('./lib/pool-connection');
const _api = {};

// pool management
_api.initPool = _poolManager.initPool;
_api.getPool = _poolManager.getPool;

// retrieve a connection scope
// default-pool: getConnection(scope)
// explicit-pool: getConnection(poolname, scope)
_api.getConnection = function(arg0, arg1=null){
    // second agument set ?
    if (arg1 === null){
        return _poolManager.getPool().getConnection(arg0);
    }else{
        return _poolManager.getPool(arg0).getConnection(arg1);
    }    
};

// expose api
module.exports = _api;