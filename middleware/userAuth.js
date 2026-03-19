import jwt from 'jsonwebtoken';
import { handleError } from '../utils/responseHandler.js';
import dotenv from 'dotenv';
import Msg from '../utils/message.js';
import { fetchUsersById } from '../models/user.model.js';
import { get_admin_data_by_id } from '../models/admin.model.js';
import { fetchSellerInfoById } from '../models/seller.model.js';
dotenv.config();

const JWT_SECRET = process.env.AUTH_SECRETKEY;
const JWT_SECRET_ADMIN = process.env.JWT_SECRET;


export const authenticateUser = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      req.user = 0;
      req.seller = 0;
      return next();
    }
    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
      return handleError(res, 401, Msg.INVALID_OR_MISSING_TOKEN);
    }
    const token = tokenParts[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return handleError(res, 401, Msg.INVALID_TOKEN);
    }
    const [user] = await fetchUsersById(decodedToken.data.id)
    if (!user) {
      return handleError(res, 404, Msg.USER_NOT_FOUND);
    }
    if (user.is_suspended == 1) {
      return handleError(res, 401, Msg.ACCOUNT_SUSPENDED);
    }
    const seller = await fetchSellerInfoById(decodedToken.data.id)

    if (seller.length > 0) {
      if (seller[0].status == 0) {
        return handleError(res, 401, Msg.SELLER_ACCOUNT_SUSPENDED);
      }
    }
    req.user = user;
    req.seller = seller[0];
    next();
  } catch (error) {
    return handleError(res, 500, Msg.INTERNAL_SERVER_ERROR);
  }
};


export const authenticateAdmin = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      return handleError(res, 401, Msg.NO_TOKEN_PROVIDED);
    }

    const tokenParts = authorizationHeader.split(' ');
    console.log(tokenParts, "tokenParts");
    if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
      return handleError(res, 401, Msg.INVALID_OR_MISSING_TOKEN);
    }
    const token = tokenParts[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET_ADMIN);
      console.log(decodedToken, "decodedToken");

    } catch (err) {
      return handleError(res, 401, Msg.INVALID_TOKEN);
    }

    const [admin] = await get_admin_data_by_id(decodedToken.id)
    if (!admin) {
      return handleError(res, 404, Msg.ADMIN_NOT_FOUND);
    }
    req.admin = admin;
    next();
  } catch (error) {
    console.log(error);

    return handleError(res, 500, Msg.INTERNAL_SERVER_ERROR);
  }
};

export const authenticateSeller = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      return handleError(res, 401, Msg.NO_TOKEN_PROVIDED);
    }
    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
      return handleError(res, 401, Msg.INVALID_OR_MISSING_TOKEN);
    }
    const token = tokenParts[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return handleError(res, 401, Msg.INVALID_TOKEN);
    }
    const [seller] = await fetchSellerInfoById(decodedToken.data.id)
    if (!seller) {
      return handleError(res, 404, 'Seller Not Found');
    }
    if (seller.status == 0) {
      return handleError(res, 400, Msg.ACCOUNT_SUSPENDED);
    }
    const [user] = await fetchUsersById(decodedToken.data.id)
    req.user = user;
    next();
  } catch (error) {
    return handleError(res, 500, Msg.INTERNAL_SERVER_ERROR);
  }
};

export const authenticateInvestor = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      req.user = 0;
      req.seller = 0;
      return next();
    }
    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
      return handleError(res, 401, Msg.INVALID_OR_MISSING_TOKEN);
    }
    const token = tokenParts[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return handleError(res, 401, Msg.INVALID_TOKEN);
    }
    req.user = decodedToken.data;
    req.user.id = decodedToken.data.id;
    next();
  } catch (error) {
    return handleError(res, 500, Msg.INTERNAL_SERVER_ERROR);
  }
};