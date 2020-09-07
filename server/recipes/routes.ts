// Router is responsible for listing all the available routes and which middlewares/controller's function should be called for each route
// Router is the dispatcher between the client and the middlewares/controller
import { Router } from 'express';
import { createRecipe, updateRecipe, deleteRecipe, listRecipes } from './controller';
import { checkBody } from '../utility/middlewares';
const router = Router();

// Create Recipe
router.post('/', [checkBody, createRecipe]);

// Update Recipe (Should be idempotent)
router.put('/:id', [checkBody, updateRecipe]);

// Delete Recipe
router.delete('/:id', [deleteRecipe]);

// List Recipes
router.get('/:uid', [listRecipes]);

export default router;
