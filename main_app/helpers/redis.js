const redis = require('redis')
const redis_client = redis.createClient()

const common = require('./common.js')

var redisDelete = function(key) {
     // Delete
    redis_client.del(key, function(err, reply) {
        console.log(key, 'key deleted')
    })
}

var redisCreate = function(key, cb) {
    var values = [1, 2, 3, 4, 5, 6, 7]
    // Create / Insert
    var store  = [key].concat(values)
    console.log(key, 'key created')
    redis_client.rpush(store, function(err, response){
        if (err) throw err
        cb()
    })
}

var redisFetchUpdate =  function(key, cb){
    // Fetch
    redis_client.lrange(key, 0, -1, function(error, result) {
        if(error) {
            response.status(500)
            response.send('Failed!! to retrieve from redis')
        } else {
            // Update
            store = [key].concat(result).concat([100, 200, 300])
            redis_client.rpush(store, function(err){
                if (err) throw err
                redis_client.lrange(key, 0, -1, function(err, result) {
                    if (err) throw err
                    cb(result)
                })
            })
            
        }
    })
}

exports.performAllAction = performAllAction = function(failure, fcb) {
    try {
        var key = 'numbers' + Date.now() + common.getRandomInt(100000)
        redisCreate(key, function(){
            redisFetchUpdate(key, function(result){
                redisDelete(key)
                return fcb(result)
            })
        })
    } catch(err) {
        failure(err)
    }
}
