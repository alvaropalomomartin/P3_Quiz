const {log, biglog, errorlog, colorize} = require("./out");
const model = require('./model');






exports.helpCmd =rl =>{
    log("Commandos:");
    log(" h|help - Muestra esta ayuda.");
    log("list - Listar los quizzes existentes.");
    log("show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
    log("add - Añadir un nuevo quiz interactivamente.\n");
    log("delete <id> - Borrar el quiz indicado.");
    log("edit <id> - Editar el quiz indicado.");
    log("test <id> - Probar el quiz indicado.\n");
    log("p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("credits - Créditos.");
    log("q|quit - Salir del programa.");
    rl.prompt();
};

exports.quitCmd =rl=>{
    rl.close();
};

exports.addCmd =rl=>{
    rl.question(colorize('Introduzca una pregunta: ', 'red'), question=>{
        rl.question(colorize('Introduzca una respuesta: ', 'red'), answer=>{
            model.add(question,answer);
            log(`${colorize('Se ha añadido','magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
            rl.prompt();
        });
    });
};

exports.listCmd =rl=>{
    model.getAll().forEach((quiz,id) =>{
        log(`[${colorize(id,'magenta')}]:${quiz.question}`);
    });
    rl.prompt();
};

exports.showCmd = (rl,id) =>{

    if(typeof id === "undefined"){
        errorlog(`Falta el parametro id.`);

    } else {
        try {
            const quiz = model.getByIndex(id);
            log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')}${quiz.answer}`);
        } catch (error){
            errorlog(error.message);
        }
    }

    rl.prompt();
};

exports.testCmd = (rl,id) =>{
    if(typeof id === "undefined") {
        errorlog(`Falta el parametro id.`);
        rl.prompt();
    }else{
        try{
            const quiz = model.getByIndex(id);
            process.stdout.isTTY && setTimeout(()=>{
                rl.write()
            },0);
            rl.question(colorize(quiz.question,'red'), answer =>{
                if ( answer.toLowerCase().trim() ===quiz.answer.toLowerCase().trim()){
                    log("Su respuesta:");
                    biglog("correcto",'green');
                    rl.prompt();
                }else{
                    log("Su respuesta:");
                    biglog("incorrecto",'red');
                    rl.prompt();
                };
            });

        }catch(error){
            errorlog(error.message);
            rl.prompt();
            }
    }

};

exports.playCmd =rl=>{
    let score = 0;
    let toBeResolver = [];
    var i =0;
    for(i;i<model.count();i++){
        toBeResolver[i]=i;

    };
    const playOne = ()=>{
        if(toBeResolver.length==0){
            log(`Fin de examen`);
            log(`Aciertos`), biglog(`${score}`);
            rl.prompt();

        }else{
            let id = toBeResolver[Math.floor(Math.random*(toBeResolver.length-1))];
            console.log("parametro id(play):"+ id);
            let quiz = model.getByIndex(id);
            var i;
            for(i=0;i<toBeResolver.length;i++){
                if(toBeResolver[i]==id){
                    toBeResolver.splice(i,1);
                }
            }
            //Podria utilizar esto??

            rl.question(colorize(`${quiz.question}?`, 'red'), answer => {
                if(answer.toLowerCase().trim()===quiz.answer.toLowerCase()){
                    score +=1;
                    log(`${colorize('La respuesta es','black')}${colorize('correcta','green')}`);
                    biglog(`Correcto`);
                    playOne();

                }else{
                    biglog(`Incorrecto`);
                    log(`Fin del examen `);
                    log(`Usted ha acertado: ${score}`,'blue');
                    rl.prompt();

                };
            });
        }
    }
    playOne();


};

exports.deleteCmd = (rl,id) =>{

    if(typeof id === "undefined"){
        errorlog(`Falta el parametro id.`);

    } else {
        try {
            model.deleteByIndex(id);

        } catch (error){
            errorlog(error.message);
        }
    }

    rl.prompt();
};

exports.editCmd = (rl,id) =>{
    if(typeof id === "undefined") {
        errorlog(`Falta el parametro id.`);
        rl.prompt();
    }else{
        try {
            const quiz = model.getByIndex(id);

            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
            rl.question(colorize('Introduzca una pregunta: ', 'red'), question=> {

                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
                rl.question(colorize('Introduzca una respuesta: ', 'red'), answer => {
                    model.update(id, question, answer);
                    log(`Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
                    rl.prompt();
                });
            });
        } catch (error){
            errorlog(error.message);
            rl.prompt();
        }
    }
};

exports.creditsCmd =rl=>{
    log('Autores de la practica:');
    log('Alvaro Palomo Martin','green');
    rl.prompt();
};