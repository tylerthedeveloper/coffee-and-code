module.exports = function (plop) {
    
    plop.setGenerator('server-route-group', {
        description: 'this is an express route to be linked to psql server',
        prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of your route: ',
        }],
        actions: [{
            type: 'add',
            path: 'routes/{{dashCase name}}.js',
            templateFile: 'plop-templates/route.js',
        }]
    });

};  
