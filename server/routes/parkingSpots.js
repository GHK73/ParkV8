//routes/parkingSpots.js
import express from 'express';
import {registerSpot,getSpotsForOwner} from '../controllers/parkingControllers.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/register',
    authenticateToken,
    authorizeRoles('owner'),
    registerSpot,
);

router.post('/owner/:ownerId',
    authenticateToken,
    authorizeRoles('owner','admin'),
    getSpotsForOwner,
);