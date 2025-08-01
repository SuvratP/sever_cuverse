import express from 'express';
import { addMessage, getMessages } from '../Controllers/Messagecontroller.js';

const router = express.Router();

router.post('/', addMessage);

router.get('/:chatId', getMessages);

export default router