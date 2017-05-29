var Estudiant = require('./model/estudiant');
var Assignatura = require('./model/assignatura');
var mongoose = require('mongoose');

// Obtiene todos los objetos estudiantes de la base de datos
/*exports.getEstudiants = function (req, res) {
    Estudiant.find(
        function (err, estudiant) {
            if (err)
                res.send(err);
            res.json(estudiant);
        }
    );
};*/


exports.getEstudiants = function (req, res) {
    var users = [];
    Estudiant.find({},null,{sort:{nom:1}},function(err,usuarios){
        for (var i = 0; i < usuarios.length; i++) {
            users.push({nom: usuarios[i].nom,
                direccio: usuarios[i].direccio,
                telefons: {casa: usuarios[i].telefons.casa, feina: usuarios[i].telefons.feina},
                estudis: usuarios[i].estudis});
        }
        res.send(users);
    });
};

//Modificar estudiante
exports.modificarEstudiant = function (req, res) {
    console.log(req.params.estudiant_id);
    Estudiant.update(
        {_id: req.params.estudiant_id},
        {
            nom: req.body.nom,
            direccio: req.body.direccio,
            telefons: {casa: req.body.telefons.casa, feina: req.body.telefons.feina},
            estudis: req.body.estudis
        },
        function (err, estudiant) {
            if (err)
                res.send(err);
            // Obtiene y devuelve todos los estudiants tras crear uno
            Estudiant.find(function (err, estudiant) {
                if (err)
                    res.send(err);
                res.json(estudiant);
            });
        }
    )
}

// Guarda un objeto Estudiant en base de datos
exports.setEstudiant = function (req, res) {

    console.log("req.body:", req.body);
    Estudiant.create(
        {
            nom: req.body.nom,
            direccio: req.body.direccio,
            telefons: {casa: req.body.telefons.casa, feina: req.body.telefons.feina},
            estudis: req.body.estudis
        },
        function (err, estudiant) {
            if (err)
                res.send(err);
            // Obtiene y devuelve todos los estudiants tras crear uno
            Estudiant.find(function (err, estudiant) {
                if (err)
                    res.send(err);
                res.json(estudiant);
            });
        });

};

/////////////////////////////////////////////////////////////////
// Obtiene todos los objetos subject de la base de datos
exports.getAssignatures = function (req, res) {
    Assignatura.find(req.query,
        function (err, assignatura) {
            if (err)
                res.send(err);
            res.json(assignatura);
        }
    );
};

exports.getAssignaturaByName = function (req, res) {
    Assignatura.findOne({nom: req.params.nom},
        function (err, assignatura) {
            if (err)
                res.send(err);
            Estudiant.populate(assignatura, {path: "estudiants"}, function (err, subjs) {
                res.json(subjs);
                console.log("subjs:", subjs);
            });
        }
    );
};

// Obtiene detalles de una asignatura
exports.getAssignatura = function (req, res) {
    Assignatura.findOne({nom: req.params.nom},
        function (err, assignatura) {
            if (err) {
                res.send(err);
                Console.log(err);
            }
            else if (assignatura == null) {
                console.log("La assignatura no existeix!");
                res.json(assignatura);
            }
            else {
                console.log("Existeix la assignatura")
                res.json(assignatura);
            }
        });
};

// Guarda un objeto subject en base de datos
exports.setAssignatura = function (req, res) {
    console.log("req.body:", req.body);
    Assignatura.create(
        {nom: req.body.nom},
        function (err, assignatura) {
            if (err)
                res.send(err);
            // Obtiene y devuelve todos los subjects tras crear una
            Assignatura.find(function (err, assignatura) {
                if (err)
                    res.send(err);
                res.json(assignatura);
                console.log(assignatura);
            });
        });
};

// Añadimos estudiante a asignatura
exports.addEstudiant = function (req, res) {
    console.log("addEstudiant req.body:", req.body);
    //Verificamos que el usuario existe
    Estudiant.findOne({nom: req.body.estudiant},
        function (err, estudiant) {
            if (err) {
                res.send(err);
                Console.log(err);
                res.json(estudiant);
            }
            else if (estudiant == null) {
                console.log("El usuari no existeix!");
                res.json(estudiant);
            }
            else {
                console.log("Existeix el usuario");
                console.log("Usuari:", estudiant.nom, "ID:", estudiant._id);
                //Añadimos usuario a la asignatura
                Assignatura.update({nom: req.body.nom},
                    {$push: {estudiants: estudiant._id}},
                    function (err, assignatura) {
                        if (err)
                            res.send(err);
                        //Devuelve la asignatura actualizada
                        Assignatura.find({nom: req.body.nom},
                            function (err, assignatura) {
                                if (err)
                                    res.send(err);
                                console.log("Afegit", assignatura);
                                res.json(assignatura);
                            });
                    });
            }
        });
};


//Obtener detalle estudiante
exports.getEstudiant = function (req, res) {
    console.log("req.params.estudiant_id:", req.params.estudiant_id);
    Estudiant.findOne({_id: req.params.estudiant_id},
        function (err, estudiant) {
            if (err) {
                res.send(err);
                Console.log(err);
            }
            else if (estudiant == null) {
                console.log("El usuari no existeix!");
                res.json(estudiant);
            }
            else {
                console.log("Existeix el usuario")
                res.json(estudiant);
            }
        });
};

exports.getEstudiantByName = function (req, res) {
    console.log("req.params.nom:", req.params.nom);

    Estudiant.findOne({nom: req.params.nom},
        function (err, estudiant) {
            if (err) {
                res.send(err);
                Console.log(err);
            }
            else if (estudiant == null) {
                console.log("El usuari no existeix!");
                res.json(estudiant);
            }
            else {
                console.log("Existeix el usuario")
                res.json(estudiant);
            }
        });
}


//Event.findOneAndUpdate({"_id": req.params._id}, {$addToSet: {attendees: req.body.attendees}}, req.body, function (err, event) {
//    console.log(event._id);

// Eliminar asignatura
exports.deleteAssignatura = function (req, res) {
    Assignatura.remove({_id: req.params.assignatura_id}, function (err, assignatura) {
        if (err)
            res.send(err);
        Assignatura.find(function (err, assignatura) {
            if (err)
                res.send(err);
            res.json(assignatura);
        });
    });
};

// Eliminar estudiante
exports.deleteEstudiant = function (req, res) {
    Estudiant.remove({_id: req.params.estudiant_id}, function (err, estudiant) {
        if (err)
            res.send(err);
        Estudiant.find(function (err, estudiant) {
            if (err)
                res.send(err);
            res.json(estudiant);
        });
    });
};