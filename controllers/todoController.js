var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to the database
mongoose.connect('mongodb://test:test@mongodb-4831-0.cloudclusters.net:10003/todos?authSource=admin');

//Create a schema
var todoSchema = new mongoose.Schema({
    item:String

});


var Todo =mongoose.model('Todo',todoSchema);
// var itemOne = Todo({item:'Buy flowers'}).save(function(err){
//     if (err) throw err;
//     console.log('item saved');
// });


// var data = [{item:'wake up'},{item:'brush teeth'},{item:'drink tea'}];
var urlEncdedParser = bodyParser.urlencoded({extended:false});

module.exports = function(app){
    // app.get('/todo',function(req,res){
    //     res.render('todo',{todos:data});
    // });

    app.get('/todo',function(req,res){
        //Get data from mongodb and pass it to the views
        Todo.find({}, function(err,data){
            if (err) throw err;
            res.render('todo',{todos :data});
        })
    });

    app.post('/todo',urlEncdedParser,function(req,res){
        //Get data from view and add it to mongodb
        var newTodo =Todo(req.body).save(function(err,data){
            if(err) throw err;
            res.json(data);
        });
        //  data.push(req.body);
        // res.json(data);
    });
    
    // app.delete('/todo/:item',function(req,res){
    //     data = data.filter(function(todo){
    //         return todo.item.replace(/ /g,'-')!== req.params.item;
    //     });
    //     res.json(data);
    // });

    app.delete('/todo/:item',function(req,res){
        //delete the requseted item from mongodb
        Todo.find({item: req.params.item.replace(/\-/g," ")}).deleteOne(function(err,data){
            if(err) throw err;
            res.json(data);
        })
    });
};
// application interface of the interface in a way that it will have some 