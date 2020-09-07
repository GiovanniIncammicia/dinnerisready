// Router is responsible for listing all the available routes and which middlewares/controller's function should be called for each route
// Router is the dispatcher between the client and the middlewares/controller
import { Router } from 'express';
import { createIngredients, deleteIngredient, listIngredients } from './controller';
import { checkBody } from '../utility/middlewares';
const router = Router();

// Create Ingredients
router.post('/', [checkBody, createIngredients]);

// Delete Ingredient
router.delete('/:id', [deleteIngredient]);

// List Ingredients
router.get('/', [listIngredients]);

export default router;
