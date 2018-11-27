module.exports = function (plop) {
  plop.setGenerator('simple-screen', {
    description: 'this is meant for  class-less screens',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of your screen: ',
      }],
    actions: [{
      type: 'add',
      path: 'app/screens/{{pascalCase name}}.js',
      templateFile: 'plop-templates/simple-screen.js',
    }],
  });

  plop.setGenerator('class-screen', {
    description: 'this is meant for full class-ful screens',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of your screen: ',
      }],
    actions: [{
      type: 'add',
      path: 'app/screens/{{pascalCase name}}.js',
      templateFile: 'plop-templates/class-screen.js',
    }],
  });

  plop.setGenerator('model', {
    description: 'this is a app model',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of your model: ',
      }],
    actions: [{
      type: 'add',
      path: 'app/models/{{dashCase name}}.ts',
      templateFile: 'plop-templates/model.js',
    }],
  });
};
