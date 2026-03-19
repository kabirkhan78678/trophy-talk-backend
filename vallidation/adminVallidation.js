import { body, query, validationResult } from 'express-validator';
import { vallidationErrorHandle } from '../utils/responseHandler.js';

// Ranch creation validation
const createRanchValidations = [
    body('name')
        .notEmpty().withMessage('Ranch name is required.')
        .isLength({ min: 3, max: 150 }).withMessage('Ranch name must be between 3 and 150 characters.'),

    body('location')
        .notEmpty().withMessage('Location is required.')
        .isLength({ min: 3, max: 150 }).withMessage('Location must be between 3 and 150 characters.'),

    body('price_per_share')
        .notEmpty().withMessage('Price per share is required.')
        .isDecimal({ decimal_digits: '0,2' }).withMessage('Price per share must be a valid decimal with up to 2 digits after the decimal.'),

    body('total_shares')
        .notEmpty().withMessage('Total shares are required.')
        .isInt({ min: 1 }).withMessage('Total shares must be a positive integer.'),

    body('shares_sold')
        .optional()
        .isInt({ min: 0 }).withMessage('Shares sold must be a non-negative integer.'),

    body('acres')
        .optional()
        .isDecimal({ decimal_digits: '0,2' }).withMessage('Acres must be a valid decimal.'),

    body('amenities')
        .optional()
        .isString().withMessage('Amenities must be text.'),

    body('projected_roi_percent')
        .optional()
        .isDecimal({ decimal_digits: '0,2' }).withMessage('Projected ROI percent must be a valid decimal (e.g., 12.50).'),

    body('description')
        .notEmpty().withMessage('Description must be require.')
        .isString().withMessage('Description must be text.'),

    body('status')
        .optional()
        .isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED']).withMessage('Status must be one of: DRAFT, PUBLISHED, ARCHIVED.'),

    body('isDeleted')
        .optional()
        .isIn([0, 1]).withMessage('isDeleted must be either 0 (not deleted) or 1 (deleted).'),
];

const adminHandleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return vallidationErrorHandle(res, errors);
    }
    next();
};


export { createRanchValidations, adminHandleValidationErrors };
