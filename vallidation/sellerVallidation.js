import { body, query, validationResult } from 'express-validator';
import { vallidationErrorHandle } from '../utils/responseHandler.js';

const applyToSellVallidations = [
    body('businessName')
        .notEmpty().withMessage('Business Name is required.')
        .isLength({ min: 3, max: 100 }).withMessage('Business Name must be between 3 and 100 characters.'),

    body('email')
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please enter a valid email address.'),

    body('bussinesslogo')
        .optional()
        .isURL().withMessage('Business logo must be a valid URL.')
        .custom((value) => {
            const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            const ext = value.split('.').pop().toLowerCase();
            if (!validExtensions.includes(ext)) {
                throw new Error('Business logo must be a valid image (jpg, jpeg, png, gif).');
            }
            return true;
        }),

];

const sellerValidations = [
    body('businessName')
        .optional()
        .notEmpty().withMessage('Business Name is required.')
        .isLength({ min: 3, max: 100 }).withMessage('Business Name must be between 3 and 100 characters.'),

    body('email')
        .optional()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please enter a valid email address.'),

    body('phone')
        .optional()
        .notEmpty().withMessage('Phone number is required.'),

    body('businessLogo')
        .optional()
        .isURL().withMessage('Business logo must be a valid URL.')
        .custom((value) => {
            const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            const ext = value.split('.').pop().toLowerCase();
            if (!validExtensions.includes(ext)) {
                throw new Error('Business logo must be a valid image (jpg, jpeg, png, gif).');
            }
            return true;
        }),

    body('bussinessDescription')
        .optional()
        .notEmpty().withMessage('Business Description is required.')
        .isLength({ min: 10, max: 500 }).withMessage('Business Description must be between 10 and 500 characters.')
];

const productValidations = [
    body('productName')
        .notEmpty().withMessage('Product Name is required.')
        .isLength({ min: 3, max: 100 }).withMessage('Product Name must be between 3 and 100 characters.'),

    body('categoryId')
        .notEmpty().withMessage('Category ID is required.')
        .isInt({ min: 1 }).withMessage('Category ID must be a valid integer.'),

    body('price')
        .notEmpty().withMessage('Price is required.')
        .isFloat({ min: 0.1 }).withMessage('Price must be a positive number.'),

    body('stock')
        .notEmpty().withMessage('Stock quantity is required.')
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer.'),

    body('productDescriptions')
        .notEmpty().withMessage('Product Description is required.')
        .isLength({ min: 10, max: 1000 }).withMessage('Product Description must be between 10 and 1000 characters.')
];

const AddProductSchema = [
    body('product_category')
        .notEmpty().withMessage('The product_category field cannot be empty. Please provide a product_category.')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('product_category can only contain letters, numbers, and underscores.'),

    body('product_description')
        .notEmpty().withMessage('The product_description field cannot be empty. Please provide a product_description.'),

    body('base_price')
        .notEmpty().withMessage('The base_price field cannot be empty. Please provide a base_price.')
        .isNumeric().withMessage('base_price must contain only numeric values')
        .isFloat({ min: 0 }).withMessage('base_price must be a positive number and cannot be less than zero.'),

    body('discount')
        .notEmpty().withMessage('The discount field cannot be empty. Please provide a discount.')
        .isNumeric().withMessage('discount must contain only numeric values')
        .isFloat({ min: 0 }).withMessage('discount must be a positive number and cannot be less than zero.'),

    body('final_price')
        .notEmpty().withMessage('The final_price field cannot be empty. Please provide a final_price.')
        .isNumeric().withMessage('final_price must contain only numeric values')
        .isFloat({ min: 0 }).withMessage('final_price must be a positive number and cannot be less than zero.'),

    // body('stock')
    //     .notEmpty().withMessage('The stock field cannot be empty. Please provide a stock.')
    //     .isNumeric().withMessage('stock must contain only numeric values')
    //     .isFloat({ min: 0 }).withMessage('stock must be a positive number and cannot be less than zero.'),

    // body('low_stock_alert')
    //     .notEmpty().withMessage('The low_stock_alert field cannot be empty. Please provide a low_stock_alert.')
    //     .isNumeric().withMessage('low_stock_alert must contain only numeric values')
    //     .isFloat({ min: 0 }).withMessage('low_stock_alert must be a positive number and cannot be less than zero.'),

    body('shipping_charge')
        .notEmpty().withMessage('The shipping_charge field cannot be empty. Please provide a shipping_charge.')
        .isNumeric().withMessage('shipping_charge must contain only numeric values')
        .isFloat({ min: 0 }).withMessage('shipping_charge must be a positive number and cannot be less than zero.'),

    body('free_shipping')
        .notEmpty().withMessage('The free_shipping field cannot be empty. Please provide a free_shipping.')
        .isNumeric().withMessage('free_shipping must contain only numeric values')
        .isFloat({ min: 0 }).withMessage('free_shipping must be a positive number and cannot be less than zero.'),
];

const UpdateProductSchema = [
    body('product_id')
        .notEmpty().withMessage('The product_id field cannot be empty. Please provide a product_id.'),

    body('product_category')
        .notEmpty().withMessage('The product_category field cannot be empty. Please provide a product_category.')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('product_category can only contain letters, numbers, and underscores.'),

    body('product_description')
        .notEmpty().withMessage('The product_description field cannot be empty. Please provide a product_description.'),

    body('base_price')
        .notEmpty().withMessage('The base_price field cannot be empty. Please provide a base_price.')
        .isNumeric().withMessage('base_price must contain only numeric values')
        .isFloat({ min: 0 }).withMessage('base_price must be a positive number and cannot be less than zero.'),

    body('discount')
        .notEmpty().withMessage('The discount field cannot be empty. Please provide a discount.')
        .isNumeric().withMessage('discount must contain only numeric values')
        .isFloat({ min: 0 }).withMessage('discount must be a positive number and cannot be less than zero.'),

    body('final_price')
        .notEmpty().withMessage('The final_price field cannot be empty. Please provide a final_price.')
        .isNumeric().withMessage('final_price must contain only numeric values')
        .isFloat({ min: 0 }).withMessage('final_price must be a positive number and cannot be less than zero.'),

    // body('stock')
    //     .notEmpty().withMessage('The stock field cannot be empty. Please provide a stock.')
    //     .isNumeric().withMessage('stock must contain only numeric values')
    //     .isFloat({ min: 0 }).withMessage('stock must be a positive number and cannot be less than zero.'),

    // body('low_stock_alert')
    //     .notEmpty().withMessage('The low_stock_alert field cannot be empty. Please provide a low_stock_alert.')
    //     .isNumeric().withMessage('low_stock_alert must contain only numeric values')
    //     .isFloat({ min: 0 }).withMessage('low_stock_alert must be a positive number and cannot be less than zero.'),

    body('shipping_charge')
        .notEmpty().withMessage('The shipping_charge field cannot be empty. Please provide a shipping_charge.')
        .withMessage('shipping_charge must be a positive number and cannot be less than zero.'),

    body('free_shipping')
        .notEmpty().withMessage('The free_shipping field cannot be empty. Please provide a free_shipping.')
        .isNumeric().withMessage('free_shipping must contain only numeric values')
        .isFloat({ min: 0 }).withMessage('free_shipping must be a positive number and cannot be less than zero.'),

    body('delete_img_id')
        .optional()
];

export const UpdateInventorySchema = [
    body('stock')
        .notEmpty().withMessage('The stock field cannot be empty. Please provide a stock.')
        .isNumeric().withMessage('stock must contain only numeric values')
        .isFloat({ min: 0 }).withMessage('stock must be a positive number and cannot be less than zero.'),
];

const DeleteProduct = [
    body('product_id')
        .notEmpty().withMessage('The product_id field cannot be empty. Please provide a product_id.')
];

const udpateProfile = [
    body('full_name')
        .optional()
        .notEmpty().withMessage('Full Name is required.')
        .isLength({ min: 3, max: 100 }).withMessage('Full Name must be between 3 and 100 characters.'),

    body('bussiness_number')
        .optional()
        .notEmpty().withMessage('Bussiness number is required.'),

    body('store_name')
        .optional()
        .notEmpty().withMessage('Store Name is required.')
        .isLength({ min: 3, max: 100 }).withMessage('Store Name must be between 3 and 100 characters.'),
];

export const passwordVallidate = [
    body('old_password')
        .notEmpty().withMessage('The old_password field cannot be empty. Please provide a old_password.')
        .isLength({ min: 8 }).withMessage('old_password Should Be At Least 8 Characters Long'),
    body('new_password')
        .notEmpty().withMessage('The new_password field cannot be empty. Please provide a new_password.')
        .isLength({ min: 8 }).withMessage('new_password Should Be At Least 8 Characters Long')
];

// Category
const AddCategoryNameSchema = [
    body('category_name')
        .notEmpty().withMessage('The category_name field cannot be empty. Please provide a category_name.')
        .isLength({ min: 3, max: 30 }).withMessage('category_name must be between 3 and 30 characters long.'),
];

const UpdateCategoryNameSchema = [
    body('category_id')
        .notEmpty().withMessage('The category_id field cannot be empty. Please provide a category_id.'),
    body('category_name')
        .notEmpty().withMessage('The category_name field cannot be empty. Please provide a category_name.')
        .isLength({ min: 3, max: 30 }).withMessage('category_name must be between 3 and 30 characters long.'),
];

const getCategoryByIdSchema = [
    body('category_id')
        .notEmpty().withMessage('The category_id field cannot be empty. Please provide a category_id.')
];

const getCategorySchema = [
    query('category_id')
        .notEmpty().withMessage('The category_id field cannot be empty. Please provide a category_id.')
];

// Cart
const UpdateCart = [
    body('product_id')
        .notEmpty().withMessage('The product_id field cannot be empty. Please provide a product_id.'),
    body('quantity')
        .notEmpty().withMessage('The quantity field cannot be empty. Please provide a quantity.')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('quantity can only contain letters, numbers, and underscores.'),
];

const DeleteCartProduct = [
    body('cart_id')
        .notEmpty().withMessage('The cart_id field cannot be empty. Please provide a cart_id.'),
];

// Favoriets // # Abhay

const AddProductToFavoriets = [
    body('product_id')
        .notEmpty().withMessage('The product_id field cannot be empty. Please provide a product_id.'),
    body('status')
        .notEmpty().withMessage('The status field cannot be empty. Please provide a status.')
        .isNumeric().withMessage('status must contain only numeric values'),
];

const GetProductId = [
    query('product_id')
        .notEmpty().withMessage('The product_id field cannot be empty. Please provide a product_id.')
];

// Shipping Address // #Abhay

const ShippingAddressValidation = [
    body('name')
        .notEmpty().withMessage('The name field cannot be empty. Please provide a name.'),
    body('email')
        .notEmpty().withMessage('The email field cannot be empty. Please provide a email.')
        .isEmail().withMessage('Please enter a valid email.'),
    body('address')
        .notEmpty().withMessage('The address field cannot be empty. Please provide a address.'),
    body('city')
        .notEmpty().withMessage('The city field cannot be empty. Please provide a city.'),
    body('state')
        .notEmpty().withMessage('The state field cannot be empty. Please provide a state.'),
    body('zipcode')
        .notEmpty().withMessage('The zipcode field cannot be empty. Please provide a zipcode.'),
    body('phone_number')
        .notEmpty().withMessage('The phone_number field cannot be empty. Please provide a phone_number.'),
    body('is_billing_address')
        .notEmpty().withMessage('The is_billing_address field cannot be empty. Please provide a is_billing_address.')
];

const updateDeliveryStatusValidation = [
    body('product_id')
        .notEmpty().withMessage('The product_id field cannot be empty. Please provide a product_id.'),
    body('delivery_status')
        .notEmpty().withMessage('The delivery status field cannot be empty. Please provide a delivery status.')
        .isNumeric().withMessage('Delivery status must contain only numeric values'),
];

const getByIdOrderListId = [
    query('product_id')
        .notEmpty().withMessage('The product_id field cannot be empty. Please provide a product_id.')
]

export const adminCommissionValidation = [
    body('admin_commission')
        .notEmpty().withMessage('The admin_commission field cannot be empty. Please provide a admin_commission.')
        .isNumeric().withMessage('admin_commission must contain only numeric values')
        .isFloat({ min: 0 }).withMessage('admin_commission must be a positive number and cannot be less than zero.'),
];

// Middleware function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return vallidationErrorHandle(res, errors);
    }
    next();
};

export {
    applyToSellVallidations,
    sellerValidations,
    productValidations,

    UpdateProductSchema,
    AddProductSchema,
    DeleteProduct,
    updateDeliveryStatusValidation,
    getCategorySchema,
    getCategoryByIdSchema,
    UpdateCategoryNameSchema,
    AddCategoryNameSchema,
    udpateProfile,
    UpdateCart,
    DeleteCartProduct,
    GetProductId,
    AddProductToFavoriets,
    ShippingAddressValidation,
    getByIdOrderListId,
    handleValidationErrors
};
