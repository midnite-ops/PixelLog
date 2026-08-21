import express from 'express';
import { sendLogs, updateLogs } from '../controllers/logController';

const routes = express.Router()

routes.post('/logs', sendLogs)
routes.put('/update-logs/:id', updateLogs)


export default routes