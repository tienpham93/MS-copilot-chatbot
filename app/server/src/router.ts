import express from 'express';
import { getTicketsHandler, postGenerateHandler, postLoginHandler } from './handlers/webchatHandlers';

const router = express.Router();

router.use('/webchat/message', postGenerateHandler);
router.use('/webchat/login', postLoginHandler);
router.use('/webchat/tickets', getTicketsHandler);

export default router;