import express from 'express';
import cors from 'cors';

const application =  express();

application.use(cors());

application.get('/', (request, response) => {
    response.send('Hello World');
});

application.listen(3333, () => {
    console.log('Server started on port 3333');
});
