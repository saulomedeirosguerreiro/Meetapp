import Express from 'express';
import routes from './routes';
import './database';

class App {
    constructor() {
        this.server = new Express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(Express.json());
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
