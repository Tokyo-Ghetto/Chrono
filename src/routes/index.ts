import express from 'express';
import { defaultRoute } from './defaultRoute.js';
import { testRoute } from '../__tests__/app.js';

export const routes = express.Router();

// Different routes go below
routes.use(defaultRoute);
routes.use(testRoute)