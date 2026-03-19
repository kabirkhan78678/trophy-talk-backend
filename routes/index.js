import express from 'express';
import userRoutes from './user.js';
import sellerRoutes from './seller.js';
import adminRoutes from './admin.js';
import investorRoutes from './investor.js';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/seller', sellerRoutes);
router.use('/admin', adminRoutes);
router.use('/investor', investorRoutes);



export default router;

