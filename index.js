var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');
var stmt;
var _mg;



app.get('/', function(req, res){
    res.sendfile('index.html');



});

app.get('/home', function(req, res){
    res.sendfile('main.html');
});


io.on('connection', function(socket){
    console.log('a user connected');


    socket.on('chat message', function(msg){




      console.log(msg);

        stmt = db.prepare("INSERT INTO user_info VALUES (?)");

        stmt.run(msg);
        stmt.finalize();
        io.emit('chat message', msg);



    });

    db.each("SELECT rowid AS id, info FROM user_info", function(err, row) {
        _mg=row.info;

        console.log(_mg);
        io.emit('chat message', _mg);


    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
})

io.emit('some event', { for: 'everyone' });

http.listen(3000, function(){
    console.log('listening on *:3000');

   var db = new sqlite3.Database('mydb.db');
    var check;

    db.serialize(function() {

        db.run("CREATE TABLE if not exists user_info (info TEXT)");





    });

    db.close();
});


