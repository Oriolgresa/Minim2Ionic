// Inicialización
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');

// Configuracion
mongoose.connect("mongodb://localhost:27017/exam", function (err) {
    if (!err) {
        console.log("Conectados a la base de datos.")
    }
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.configure(function() {
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Cargamos los endpoints
require('./routes/index.js')(app);

// Cogemos el puerto para escuchar
app.listen(3800, function () {
    console.log('App listening on port 3800.')
});
