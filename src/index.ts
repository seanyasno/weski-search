import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

const application =  express();

application.use(morgan('common'));
application.use(helmet());
application.use(cors());
application.use(express.json());

application.get('/', (request, response) => {
    response.send('Hello World');
});

application.listen(3333, () => {
    console.log('Server started on port 3333');
});
