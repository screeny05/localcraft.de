Building SynergyTube #1 - NodeJS und MySQL
29. Apr 2013 20:18
JavaScript, MySQL, NodeJS, Socket.IO

Mein aktuelles Abenteuer, dass davon handelt wie Ich SynchTube nachbaue bringt einiges an Erfahrung mit, bezüglich NodeJS. Und weil Ich hier ja schon so einen großartigen Blog habe, kann Ich doch auch darüber schreiben. Im Ersten Teil dieser (bestimmt fortgesetzten) Serie zeige Ich euch eine große Tücke, die umgangen werden will, wenn man Socket.IO mit einer MySQL-Datenbank benutzen will.

<!-- more -->

Arbeitet man mit Socket.IO und dem MySQL-Modul von [@felixge](http://github.com/felixge), stößt man schnell auf ein kleines Problem, vorausgesetzt man benutzt keinen Connection-Pool.

*Ein kleines Beispiel:*

```javascript
var io = require('socket.io').listen(8080);
var mysql = require('mysql');
 
var sql = mysql.createConnection({
    user: "user",
    password: "pass",
    database: "db"
});
 
sql.connect(function(err){
    if(err)
        console.log(err);
});
 
io.sockets.on('connection', function(socket){
    sql.query('SELECT username FROM User WHERE user_id = ' + sql.escape(socket.query.user_id),
	function(err, rows){
        socket.emit('msg', { content: 'hello, ' + rows[0].username });
    });
});
```

Das Problem, dass sich hierbei stellt:
MySQL schliesst unsere Verbindung nach einer gewissen Zeit ohne Queries &mdash; also in unserem Fall nach einer Zeit ohne Socket-Connections &mdash; mit dem Fehler `"PROTOCOL_CONNECTION_LOST"`.

Um zu verhindern, dass unsere Verbindung für immer erloschen bleibt, bietet sich folgende Lösung an:

```javascript
var io = require('socket.io').listen(8080);
var mysql = require('mysql');
var connected = false;
var config = {
    user: "user",
    password: "pass",
    database: "db"
};
 
var onError = function(err){
    if(err){
        console.log(err);
        if(err.code === "PROTOCOL_CONNECTION_LOST")
        connected = false;
    }
    if(!exports.connected){
        var re = setInterval(function(){
            if(connect())
                clearInterval(re);
            else
                console.log("re-connect-attempt failed");
        }, 5000);
    }
};
 
var connect = function(){
    sql = mysql.createConnection(config);
    sql.connect(function(err){
        if(err) {
            console.log(err);
            connected = false;
        } else {
            connected = true;
            sql.on("error", onError);
        }
        return connected;
    });
};
 
io.sockets.on('connection', function(socket){
    sql.query('SELECT username FROM User WHERE user_id = ' + sql.escape(socket.query.user_id),
	function(err, rows){
        socket.emit('msg', { content: 'hello, ' + rows[0].username });
    });
});
```

Das sorgt dann dafür, dass nach Abbruch der Verbindung, durch einen Timeout, alle 5 Sekunden versucht wird die Verbindung wiederherzustellen.
