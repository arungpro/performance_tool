const express = require('express')
const app = express()

app.get('/', function(request, response){
    process.nextTick(function() {
        response.end()
    })
    console.log('Aux get ran for awhile')
    response.send('Aux get ran for awhile')
})

app.listen('3002', function(){
    console.log('listening to post 3002......')
})
