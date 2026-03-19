import { body, query, validationResult } from 'express-validator';
import { vallidationErrorHandle } from '../utils/responseHandler.js';


const investorLoginVallidations = [
    body('email')
        .notEmpty().withMessage('The email field cannot be empty. Please provide your email address.')
        .isEmail().withMessage('Please enter a valid email address (e.g., example@example.com).'),


    body('password')
        .notEmpty().withMessage('The password field cannot be empty. Please provide a password.')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
        .matches(/\d/).withMessage('Password must contain at least one digit.')
        .matches(/[!@#$%^&*]/).withMessage('Password must include at least one special character (e.g., !@#$%^&*).')
        .matches(/[A-Z]/).withMessage('Password must include at least one uppercase letter.')
];

// Middleware function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return vallidationErrorHandle(res, errors);
    }
    next();
};
export { investorLoginVallidations, handleValidationErrors };