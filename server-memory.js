/* não é usual
import { createServer } from 'node:http';

const server = createServer((request, response) => {
    response.write('Hello world'); // escreve a resposta para o cliente
    return response.end(); // restorna a resposta e fecha a comunicação
});

server.listen(3333); // localhost:3333
*/

import { fastify } from 'fastify';
import { DatabaseMemory } from './database-memory.js';

const server = fastify();
const database = new DatabaseMemory();

server.post('/videos', (request, reply) => {
    const {
        title, description, duration
    } = request.body;

    
    database.create({
        title,
        description,
        duration,
    });

    // consegue manipular o status code (201 - algo foi criado)
    return reply.status(201).send();
});

server.get('/videos', (request) => {
    const search = request.query.search;
    const videos = database.list(search);

    return videos;
});

server.put('/videos/:id', (request, reply) => {
    const videoId = request.params.id;
    const {
        title, description, duration
    } = request.body;

    database.update(videoId, {
        title,
        description,
        duration
    });

    // (204) - teve sucesso, mas não tem conteúdo na resposta
    return reply.status(204).send();
});

server.delete('/videos/:id', (request, reply) => {
    const videoId = request.params.id;

    database.delete(videoId);

    return reply.status(204).send();
});

server.listen({
    port: 3333, // localhost:3333
});
