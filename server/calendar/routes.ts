// Router is responsible for listing all the available routes and which middlewares/controller's function should be called for each route
// Router is the dispatcher between the client and the middlewares/controller
import { Router } from 'express';
import { createEvent, createEvents, deleteEvent, listEvents } from './controller';
import { checkBody } from '../utility/middlewares';
const router = Router();

// Create Event
router.post('/', [checkBody, createEvent]);

// Create Event
router.post('/createEvents', [checkBody, createEvents]);

// Delete Event
router.delete('/:id', [deleteEvent]);

// List Events
router.get('/:uid', [listEvents]);

export default router;
