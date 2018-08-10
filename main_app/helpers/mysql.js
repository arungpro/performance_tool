const mysql = require('mysql')

const common = require('./common.js')

const pool = mysql.createPool({
    connectionLimit : 20,
    host            : 'localhost',
    port            : '3388',
    user            : 'root',
    password        : 'admin',
    database        : 'performance_tool_nodejs'
})

runSQLQuery = function(sql, msg, cb, flag = false, fcb) {
    pool.query(sql, function (err, result) {
        if (err) throw err
        console.log(sql)
        cb()
        if (flag) {
            return fcb(result)
        }
    })
}

var insertRows = function(table, i, fcb){
    // Insert functionality.
    if(i <= 25) {
        var sql = 'INSERT INTO ' + table +' (val) VALUES (100)'
        var msg = i + ' record inserted'
        if(i != 25) {
            runSQLQuery(sql, msg, function(){
                insertRows(table, i + 1, fcb)
            })
        } else {
            runSQLQuery(sql, msg, function(){
                updateRows(table, 1, fcb)
            })
        }
    }
}

var updateRows = function(table, i, fcb){
    if(i <= 25) {
        var j = i + 100
        var sql = 'UPDATE ' + table + ' set val = ' + j + ' WHERE id = ' + i
        var msg = i + ' record updated'
        if(i != 25) {
            runSQLQuery(sql, msg, function(){
                updateRows(table, i + 1, fcb)
            })
        } else {
            runSQLQuery(sql, msg, function(){
                deleteRows(table, 20, fcb)
            })
        }
    }
}

var deleteRows = function(table, i, fcb){
    // Delete functionality
    if(i <= 25) {
        var sql = 'DELETE FROM ' + table + ' WHERE id = ' + i
        var msg = i + ' record deleted'
        runSQLQuery(sql, msg, function(){
            deleteRows(table, i + 1, fcb)
        })
    } else {
        selectRow(table, fcb)
    }
}

var selectRow = function(table, fcb){
    // Select functionality
    var sql = 'SELECT * FROM ' + table
    runSQLQuery(
        sql,
        sql, 
        function(){
            process.nextTick(function(){
                dropTable(table)
            })
        }, 
        true,
        fcb
    )
}

var dropTable = function(table){
    // Drop table functionality
    var sql = 'DROP TABLE ' + table
    runSQLQuery(sql, sql, function(){})
}

module.exports.performAllAction = function(failure, sucess) {
    try {
        var tableName = 'test' + Date.now() + common.getRandomInt(100000)

        var sql = 'CREATE TABLE ' + tableName +' (id int NOT NULL AUTO_INCREMENT, val int, PRIMARY KEY (id))'
        pool.query(sql, function (err) {
            if (err) throw err
            
            insertRows(tableName, 1, sucess)
        })
    } catch(err) {
        failure(err)
    }
}

module.exports.init = function(failure, success) {
    // Create DB functionality
    try {
        var connection = mysql.createConnection({
            host            : 'localhost',
            port            : '3388',
            user            : 'root',
            password        : 'admin',
        })
        console.log('Connected to MYSQL!!!')
        var sql = 'CREATE DATABASE IF NOT EXISTS performance_tool_nodejs'
        var msg = 'Database created'
        connection.query(sql, function (error, results, fields) {
            if (error) throw error
            success()
        })
    } catch(error) {
        failure(error)
    }
}
