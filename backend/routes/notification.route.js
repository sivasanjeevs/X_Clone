import express from 'express';
import { protectroute } from '../middleware/protectroute.js';

import { getNotifications, deleteNotifications} from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/', protectroute, getNotifications);
router.delete('/', protectroute, deleteNotifications);
//router.delete('/:id', protectroute, deleteNotification);

export default router;