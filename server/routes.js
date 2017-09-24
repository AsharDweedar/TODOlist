var todos = require('./routers/todos.js');
var users = require('./routers/users.js');
var router = require('express').Router();

//Connect controller methods to their corresponding routes
router.get('/todos', todos.get);

router.post('/todos', todos.post);

router.delete('/todos', todos.delete);


router.get('/users', users.get);

router.post('/users', users.post);

router.delete('/todos', todos.delete);


module.exports = router;

