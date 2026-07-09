import express from 'express';
import { sendLogs } from '../controllers/logController';

const routes = express.Router()

routes.post('/logs', sendLogs)


export default routes