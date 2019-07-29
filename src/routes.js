import { Router } from 'express';
import multer from 'multer';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import auth from './app/middlewares/auth';
import multerConfig from './config/multer';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';

const routes = new Router();
const uploads = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.use(auth);
routes.post('/files', uploads.single('file'), FileController.store);
routes.put('/users', UserController.update);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);
routes.get('/meetups', MeetupController.index);
routes.delete('/meetups/:id', MeetupController.delete);

export default routes;
