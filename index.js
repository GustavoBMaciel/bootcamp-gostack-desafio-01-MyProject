const express = require('express');

const server = express();

server.use(express.json());

let checkRequests = 0;
const projects = [];

//Middlewar para validar se o projeto existe
function checkProject(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if(!project){
    return res.status(400).json({ error: "Project not exist!"});
  }

  return next();
};

//Middlewar para verificar quabtas requisições foram feitas
function checkRequest(req, res, next) {
  checkRequests++;
  console.log(`Total de requisições até o momento: ${checkRequests}`);

  return next();
};

//Listando todos os projetos
server.get('/projects', checkRequest, (req, res) => {
  return res.json(projects);
});

//Criando o cabeçalho do projeto
server.post('/projects', checkRequest, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project)
});

//Alterando o titulo do projeto
server.put('/projects/:id', checkProject, checkRequest, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

//Excluindo o projeto
server.delete('/projects/:id', checkRequest, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1)

  return res.json(projects);
});

//Criando uma tarefa para o projeto especifico
server.post('/projects/:id/tasks', checkRequest, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
  
});

server.listen(3000);
