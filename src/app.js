const express = require('express');
const cors = require('cors');
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];
const likes = []

function validateUuid(request, response, next) {
  const { id } = request.params

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid Repository Id'})
  }

  return next()
}

app.use('/repositories/:id', validateUuid)

app.get('/repositories', (request, response) => {
  response.json(repositories)
});

app.get('/repositories/:id', (request, response) => {
  const { id } = request.params

  const repository = repositories.find(repository => repository.id === id)

  if(repository === undefined) {
    return response.status(400).json({ error: 'Repository not found'})
  }

  return response.json(repository)
})

app.post('/repositories', (request, response) => {
  const { title, url, techs, likes } = request.body
  const repository = { id: uuid(), title, url, techs, likes}
  repositories.push(repository)

  return response.json(repository)  
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body
  const repositoryIndex = repositories.findIndex(repository => repository.id === id )

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'})
  }

  const likes = repositories[repositoryIndex].likes

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex(repository => repository.id === id )

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'})
  }

  repositories.splice(repositoryIndex, 1)

  response.status(204).send()
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id )

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'})
  }

  likes.push(id)
  const likeCount = likes.filter(l => l === id).length

  repositories[repositoryIndex].likes = likeCount

  return response.send(repositories[repositoryIndex])
});

module.exports = app;
