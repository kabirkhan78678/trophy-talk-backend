import db from "../config/db.js";

/**=======================user model start =====================================*/

export const getUserDetailById = async (ID) => {
    return db.query('select * from tbl_users where id = ?', [ID]);
};

export const updateUserPasswordModel = async (Data, ID) => {
    return db.query('update tbl_users set ? where id = ?', [Data, ID]);
};

export const isUsersExistsOrNot = async (email) => {
    return db.query("SELECT * FROM tbl_users WHERE email = ?", [email]);
};

export const userRegistration = async (data) => {
    return db.query("INSERT INTO tbl_users SET ?", [data]);
};

export const fetchAllCategory = async () => {
    return db.query("SELECT * FROM tbl_category");
};

export const addMeAsSeller = async (data) => {
    return db.query("INSERT INTO tbl_sellers SET ?", [data]);
};

export const fetchSellerInfoById = async (id) => {
    return db.query("SELECT * FROM tbl_sellers WHERE userId=? ", [id]);
};

export const productCreateBySellerId = async (data) => {
    return db.query("INSERT INTO tbl_sellerproducts SET ?", [data]);
};

export const getSellerDetailsByUserId = async (ID) => {
    return db.query('select * from tbl_sellers where userId = ?', [ID]);
};

export const getSellerDetailsBySeller_d = async (ID) => {
    return db.query('select * from tbl_sellers where id = ?', [ID]);
};

export const updateSellerInfo = async (updatedFields, id) => {
    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    values.push(id);
    const query = `UPDATE tbl_sellers SET ${setClause} WHERE userId = ?`;
    return db.query(query, values);
};

export const updateSellerDataModel = async (Data, ID) => {
    return db.query(`Update tbl_sellers set ? Where userId = ?`, [Data, ID]);
};

export const deleteSellerById = async (ID) => {
    return db.query('DELETE FROM tbl_sellers WHERE id = ?', [ID])
};


export const addProductModel = async (Data) => {
    return db.query('Insert into tbl_products set ?', [Data]);
};

export const addProductImageModel = async (Data) => {
    return db.query('Insert into tbl_productImg set ? ', [Data]);
};

export const updateProductModel = async (Data, ID) => {
    return db.query('Update tbl_products set ? where pId = ?', [Data, ID]);
};

export const getProductListModal = async (ID) => {
    return db.query(
        `Select * from tbl_products WHERE tbl_products.seller_id = ? AND tbl_products.status = 0 ORDER BY tbl_products.created_at DESC;`, [ID]
    )
};

export const deleteProductImageModal = async (ID) => {
    return db.query('DELETE FROM tbl_productImg WHERE tbl_productImg.pImg_id = ?', [ID])
};

export const getProductDataByIdModal = async (ID) => {
    return db.query('select * from tbl_products where tbl_products.pId = ?', [ID])
};

export const deleteProductByIdModal = async (Data, ID) => {
    return db.query('Update tbl_products set ? where pId = ?', [Data, ID]);
};

export const getUserProductListModal = async (ID) => {
    return db.query(
        `Select * from tbl_products WHERE tbl_products.seller_id != ? AND tbl_products.status = 0 ORDER BY tbl_products.created_at DESC`, [ID]
    )
};

export const getUserProductImagesModal = async (ID) => {
    return db.query(
        `Select * from tbl_productImg
WHERE 
    tbl_productImg.pId = ?
ORDER BY 
    tbl_productImg.created_at DESC;`, [ID]
    );
};

export const getProductDetailsById = async (ID) => {
    return db.query(`Select * from tbl_products WHERE tbl_products.pId = ?`, [ID]);
};

export const getProductImageModal = async (ID) => {
    return db.query('select * FROM tbl_productImg WHERE tbl_productImg.pImg_id = ?', [ID])
};

// Dashboard
export const getDashboartCount = async (ID) => {
    return db.query(`SELECT COUNT(*) AS product_count FROM tbl_products where seller_id = ? AND status = 0`, [ID]);
};

// Category
export const getCategoryDataByName = async (Name) => {
    return db.query(`select * from tbl_product_category where category_name = ?`, [Name]);
};

export const getCategoryDataByNameInUpdate = async (Name, category_id) => {
    return db.query(`select * from tbl_product_category where category_name = ? AND id != ?`, [Name, category_id]);
};

export const getCategoryDataById = async (Name, ID) => {
    return db.query(`select * from tbl_product_category where id = ? AND seller_id = ?`, [Name, ID]);
};

export const getCategoryDataByCategoryID = async (ID) => {
    return db.query(`select * from tbl_product_category where id = ?`, [ID]);
};

export const addProductCategoryModel = async (Data) => {
    return db.query(`insert into tbl_product_category set ?`, [Data]);
};

export const upadteProductCategoryModel = async (Data, ID) => {
    return db.query('update tbl_product_category set ? where id = ?', [Data, ID]);
};

export const getAllProductCategoryModel = async () => {
    return db.query(`select * from tbl_product_category where is_active = 0 ORDER BY created_at DESC`);
};

export const getAllProductCategoryBySellerIdModel = async (ID) => {
    return db.query(`select * from tbl_product_category where seller_id = ? AND is_active = 0`, [ID]);
};

export const getProductCategoryByIDModel = async (ID) => {
    return db.query(`select * from tbl_product_category where id = ?`, [ID]);
};


export const fetchSellerByEmail = async (email) => {
    return db.query("SELECT * FROM tbl_sellers WHERE email = ?", [email]);
};

export const getProductDetailsId = async (ID) => {
    return db.query(`Select * from tbl_products WHERE tbl_products.pId = ? AND status = 0`, [ID]);
};

export const fetchcartByUserId = async (product_id, ID) => {
    return db.query(`Select * from tbl_users_cart WHERE pId=? And user_id = ?`, [product_id, ID]);
};

export const fetchfavroiteByUserIdAndProductId = async (product_id, ID) => {
    return db.query(`Select * from tbl_favorites WHERE pId=? And user_id = ?`, [product_id, ID]);
};

export const getAllSellerProductListModal = async () => {
    return db.query(
        `Select * from tbl_products WHERE tbl_products.status = 0 ORDER BY tbl_products.created_at DESC`
    )
};

export const fetchAdmin = async () => {
    return db.query("SELECT * FROM tbl_admin ");
};


// Inventory
// export const getInventoryDataCountModel = async (ID) => {
//     return db.query(`
//     SELECT 
//     COUNT(*) AS product_count, 
//     SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) AS out_of_stock_count,
//     SUM(CASE WHEN stock_quantity > 0 AND stock_quantity <= COALESCE(low_stock_alert, 0) THEN 1 ELSE 0 END) AS low_stock_count
//     FROM tbl_products 
//     WHERE seller_id = ? AND status = 0
//     `, [ID]);
// };

export const fetchUsersByEmail = async (id) => {
    return db.query("SELECT * FROM tbl_users WHERE email = ?", [id]);
};

export const updateUsersGenToken = async (updatedFields, email) => {
    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    values.push(email);
    const query = `UPDATE tbl_users SET ${setClause} WHERE email = ?`;
    return db.query(query, values);
};


export const updatePasswordByGenToken = async (updatedFields, token) => {
    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    values.push(token);
    const query = `UPDATE tbl_users SET ${setClause} WHERE genToken = ?`;
    return db.query(query, values);
};

export const getSupportDataModel = async (ID) => {
    return db.query('Select * from tbl_usersupport where user_id = ? ORDER BY createdAt DESC', [ID])
};

// Order Management
export const getProductOrderDataModel = async (ID) => {
    return db.query(`SELECT oi.*, p.pId FROM tbl_order_items oi JOIN tbl_products p ON oi.product_id = p.pId WHERE p.seller_id = ?`, [ID]);
};

export const getOrderManagementDataModel = async (Order_id) => {
    return db.query(`SELECT * FROM tbl_orders WHERE id = ?`, [Order_id]);
};

export const getShippingProductAddress = async (ID) => {
    return db.query(`Select * from tbl_users_shipping_address where id = ?`, [ID]);
};

// Sales Summary 
export const getDashboardSalesModel = async (ID) => {
    return db.query(`
        SELECT 
    IFNULL(SUM(CASE 
        WHEN DATE(oi.createdAt) = CURDATE() 
        THEN (oi.quantity * oi.price_at_order) + oi.delivery_charge
        ELSE 0 
    END), 0) AS today_earnings,
    IFNULL(SUM(CASE 
        WHEN YEARWEEK(oi.createdAt, 1) = YEARWEEK(CURDATE(), 1) 
        THEN (oi.quantity * oi.price_at_order) + oi.delivery_charge
        ELSE 0 
    END), 0) AS week_earnings,
    IFNULL(SUM(CASE 
        WHEN MONTH(oi.createdAt) = MONTH(CURDATE()) 
             AND YEAR(oi.createdAt) = YEAR(CURDATE()) 
        THEN (oi.quantity * oi.price_at_order) + oi.delivery_charge
        ELSE 0 
    END), 0) AS month_earnings,
    IFNULL(SUM(CASE 
        WHEN MONTH(oi.createdAt) = MONTH(CURDATE()) 
             AND YEAR(oi.createdAt) = YEAR(CURDATE()) 
        THEN (oi.quantity * oi.price_at_order) + oi.delivery_charge
        ELSE 0 
    END), 0) / DAY(CURDATE()) AS avg_per_day
    FROM tbl_order_items oi
    JOIN tbl_products p ON oi.product_id = p.pId
    WHERE p.seller_id = ?
    `, [ID]);
};

export const getYearGraphDataModel = async (Data, ID) => {
    return db.query(`
        SELECT 
  CASE m.month
    WHEN 1 THEN 'Jan' WHEN 2 THEN 'Feb' WHEN 3 THEN 'Mar'
    WHEN 4 THEN 'Apr' WHEN 5 THEN 'May' WHEN 6 THEN 'Jun'
    WHEN 7 THEN 'Jul' WHEN 8 THEN 'Aug' WHEN 9 THEN 'Sep'
    WHEN 10 THEN 'Oct' WHEN 11 THEN 'Nov' WHEN 12 THEN 'Dec'
  END AS day,
  IFNULL(SUM((oi.price_at_order * oi.quantity) + oi.delivery_charge), 0) AS total_earning
FROM (
    SELECT 1 AS month UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 
    UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12
) AS m
LEFT JOIN (
    SELECT oi.*
    FROM tbl_order_items oi
    JOIN tbl_products p ON oi.product_id = p.pId
    WHERE p.seller_id = ?
) AS oi
  ON MONTH(oi.createdAt) = m.month AND YEAR(oi.createdAt) = ?
GROUP BY m.month
ORDER BY m.month
    `, [ID, Data])
};

export const getTotalyearEarningModel = async (Data, ID) => {
    return db.query(`SELECT 
  IFNULL(SUM((oi.price_at_order * oi.quantity) + oi.delivery_charge), 0) AS yearly_total
FROM tbl_order_items oi
JOIN tbl_products p ON oi.product_id = p.pId
WHERE p.seller_id = ? AND YEAR(oi.createdAt) = ?`, [ID, Data]);
};

export const getTotalMonthlyEarningModel = async (Data) => {
    return db.query(`SELECT 
  IFNULL(SUM((oi.price_at_order * oi.quantity) + oi.delivery_charge), 0) AS monthly_total
FROM tbl_order_items oi
JOIN tbl_products p ON oi.product_id = p.pId
WHERE p.seller_id = ? AND YEAR(oi.createdAt) = ? AND MONTH(oi.createdAt) = ?`, [Data?.seller_id, Data?.year, Data?.filter_for])
}

export const getMonthYearGraphDataModel = async (Data) => {
    return db.query(`SELECT 
  d.day AS day,
  IFNULL(SUM((oi.price_at_order * oi.quantity) + oi.delivery_charge), 0) AS total_earning
FROM (
    SELECT 1 AS day UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 
    UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12
    UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16
    UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20
    UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24
    UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28
    UNION ALL SELECT 29 UNION ALL SELECT 30 UNION ALL SELECT 31
) AS d
LEFT JOIN (
    SELECT oi.*
    FROM tbl_order_items oi
    JOIN tbl_products p ON oi.product_id = p.pId
    WHERE p.seller_id = ?
) AS oi
  ON DAY(oi.createdAt) = d.day 
     AND MONTH(oi.createdAt) = ? 
     AND YEAR(oi.createdAt) = ?
GROUP BY d.day
ORDER BY d.day`, [Data?.seller_id, Data?.filter_for, Data?.year]);
};


export const getYearlyOrderDataModel = async (Data, ID) => {
    return db.query(`SELECT DISTINCT oi.order_id, o.createdAt
FROM tbl_order_items oi
JOIN tbl_products p ON oi.product_id = p.pId
JOIN tbl_orders o ON o.id = oi.order_id
WHERE p.seller_id = ?
  AND YEAR(o.createdAt) = ?
ORDER BY o.createdAt DESC`, [ID, Data])
};

export const getMonthlyOrderDataModel = async (Data) => {
    return db.query(`
   SELECT order_id
FROM (
    SELECT DISTINCT oi.order_id, o.createdAt
    FROM tbl_order_items oi
    JOIN tbl_products p ON oi.product_id = p.pId
    JOIN tbl_orders o ON o.id = oi.order_id
    WHERE p.seller_id = ?
      AND YEAR(o.createdAt) = ?
      AND MONTH(o.createdAt) = ?
) AS sub
ORDER BY sub.createdAt DESC
  `, [Data?.seller_id, Data?.year, Data?.filter_for]);
};

export const getTopProductListModel = async (Data) => {
    return db.query(`SELECT p.*, 
SUM(oi.quantity) AS total_quantity_sold
FROM tbl_order_items oi
JOIN tbl_products p ON oi.product_id = p.pId
WHERE p.seller_id = ?
GROUP BY p.pId
ORDER BY total_quantity_sold DESC`, [Data]);
};

export const getAllSellProductListModel = async (ID) => {
    return db.query(`SELECT * 
        FROM tbl_order_items oi 
        JOIN tbl_products p
        ON oi.product_id = p.pId 
        WHERE p.seller_id = ?` , [ID]
    );
};

export const getProductDataByOrderId = async (ID) => {
    return db.query(`SELECT *
        FROM tbl_orders
        WHERE id= ?`, [ID]
    );
};

export const getSelledProductByIDModel = async (ID) => {
    return db.query(`SELECT * 
        FROM tbl_order_items 
        WHERE id = ?` , [ID]
    );
};

export const updateProductDeliveryStatusModel = async (Data, ID) => {
    return db.query('Update tbl_order_items set ? where id = ?', [Data, ID]);
};


export const getAllSellProductListByIdModel = async (ID) => {
    return db.query(`SELECT * 
        FROM tbl_order_items oi 
        JOIN tbl_products p
        ON oi.product_id = p.pId 
        WHERE oi.id = ? ORDER BY oi.createdAt	DESC ` , [ID]
    );
};

// Seller Payout

export const getLastPayoutDataModel = async (ID) => {
    return db.query(`
    SELECT IFNULL(SUM(total_payout), 0) 
    AS total_amount 
    FROM tbl_seller_payout 
    WHERE seller_id = ?
    `, [ID]);
};

export const getListOfTotalPayoutToSeller = async (ID) => {
    return db.query(`
    SELECT *
    FROM tbl_seller_payout
    WHERE seller_id = ?
    ORDER BY id DESC
    `, [ID]);
};



// ----------------------------------karan patel------------------------------------------------------------//


export const fetchSellerOnBoardProfileCompleteOrnot = async (ID) => {
    return db.query(`
    SELECT * FROM tbl_seller_account WHERE seller_id = ? ORDER BY id DESC `, [ID]);
};

export const getContentManagementList = async () => {
    return db.query(`
    SELECT *
    FROM tbl_content_management
    ORDER BY content_type DESC
    `);
};


// --------------------seller-boost-product--------------------------------

export const getPromotionPackageById = async (ID) => {
    return db.query(`
    SELECT *
    FROM tbl_promotion_packages
    WHERE id = ?
    `, [ID]);
};


export const insertBoostProducts = async (data) => {
    return db.query(`Insert into tbl_boost_product set ? `, [data]);
};


export const updateProductBoost = async (ID) => {
    console.log('ID', ID);

    return db.query('update tbl_products set is_boost = 1 where pId  = ?', [ID]);
};

export const fetchBoostProductsBySellerId = async (ID) => {
    return db.query(`SELECT * FROM tbl_boost_product WHERE user_id = ? `, [ID]);
};

export const fetchBoostProductsByProductId = async (ID) => {
    return db.query(`SELECT * FROM tbl_boost_product WHERE product_id = ? `, [ID]);
};

export const fetchBoostActiveProductsByProductId = async (ID) => {
    return db.query(`SELECT * FROM tbl_boost_product WHERE product_id = ? AND current_status = 1`, [ID]);
};

export const fetchAllPromotionPackagesModel = async () => {
    return db.query(`SELECT * FROM tbl_promotion_packages `);
};

export const fetchAllBoostedProduct = async (id) => {
    return db.query(
        `Select * from tbl_products WHERE tbl_products.status = 0 And tbl_products.is_boost = 1 AND tbl_products.seller_id != ? ORDER BY tbl_products.created_at DESC`, [id]
    )
};

export const updateProductViewed = async (id, updateViewed) => {
    return db.query('update tbl_products set viewed = ? where pId  = ?', [updateViewed, id]);
};

export const fetchBoostedProductById = async (ID) => {
    return db.query(`SELECT * FROM tbl_boost_product WHERE id = ? `, [ID]);
};

export const fetchBoostedAnalyticsProductById = async (ID) => {
    return db.query(`SELECT COUNT(*) as boost_count FROM tbl_product_boost_analytics WHERE boosted_product_id = ?`, [ID]);
};

export const fetchAllBoostProducts = async () => {
    return db.query(`SELECT * FROM tbl_boost_product WHERE current_status = 1`);
};

export const deleteExpiredBoostProducts = async (id) => {
    return await db.query('DELETE FROM tbl_boost_product WHERE id = ?', [id]);
};

export const updateExpiredBoostProducts = async (id) => {
    return await db.query('Update tbl_boost_product SET current_status = 0 WHERE id = ?', [id]);
};

export const updateProductTableIsBoost = async (ID) => {
    return db.query('update tbl_products set is_boost = 0 where pId  = ?', [ID]);
};

export const fetchAllFeaturedBoostedProduct = async () => {
    return db.query(
        `Select * from tbl_products WHERE tbl_products.status = 0 And tbl_products.is_boost = 1  ORDER BY tbl_products.created_at DESC`
    )
};

export const fetchAllPromotionPackagesModelByIds = async (id) => {
    return db.query(`SELECT * FROM tbl_promotion_packages Where id=?`, [id]);
};


// -------------------------size variants---------------------------------------

export const fetchProductSizesModel = async (category) => {
    return db.query(`SELECT size_system, fit_type, size_value FROM tbl_size_master WHERE category=? AND is_active = 1 AND size_system = ?`, [category, 'US']);
};

export const fetchProductSizesApperelsModel = async (category) => {
    return db.query(`SELECT size_system, fit_type, size_value FROM tbl_size_master WHERE category=? AND is_active = 1 `, [category]);
};

export const addProductColorModel = async (productId, colorName) => {
    return db.query(`INSERT INTO tbl_product_colors (pid, color_name) VALUES (?, ?)`, [productId, colorName]);
}

export const fetchSizeIdBySystemAndValueModel = async (sizeCategory, size_system, size_value) => {
    return db.query(`SELECT id FROM tbl_size_master WHERE category=? AND size_system=? AND size_value=? AND is_active=1`, [sizeCategory, size_system, size_value]);
};

export const addProductVariantModel = async (productId, color_id, sizeRow_id, stock, low_stock) => {
    return db.query(`INSERT INTO tbl_product_variants (pid, color_id, size_id, stock_quantity, low_stock_alert)
           VALUES (?, ?, ?, ?, ?)`, [productId, color_id, sizeRow_id, stock, low_stock]);
}

export const getProductVariantsByPid = async (productId, color_id) => {
    return db.query(`SELECT v.id AS variant_id, v.stock_quantity, v.low_stock_alert,s.size_system,s.size_value,s.fit_type,s.id AS size_id,v.color_id
                     FROM tbl_product_variants v
                     JOIN tbl_size_master s ON s.id = v.size_id
                      WHERE v.pid = ? AND v.color_id = ? `, [productId, color_id]);
}

export const getUserProductImagesByColorModal = async (ID, color_id) => {
    return db.query(`SELECT * FROM tbl_productimg WHERE pid = ? AND color_id = ?`, [ID, color_id]);
};

export const getProductColorsByPid = async (ID) => {
    return db.query(`SELECT id, color_name FROM tbl_product_colors WHERE pid = ? `, [ID]);
};

export const updateProductVariantModel = async (product_id) => {
    return db.query(`DELETE FROM tbl_product_variants WHERE pid = ?`, [product_id]);;
};

export const getAllProductCategoryByadminModel = async (Name) => {
    return db.query(`select * from tbl_product_category where category_name = ?`, [Name]);
};

export const getProductColorsByPidAndColorName = async (ID, colorName) => {
    return db.query(`SELECT id FROM tbl_product_colors WHERE  pid=? AND color_name=?`, [ID, colorName]);
};

export const addProductColorsByPidAndColorName = async (product_id, colorName) => {
    return db.query(`INSERT INTO tbl_product_colors (pid, color_name) VALUES (?, ?)`, [product_id, colorName]);
};

export const getDataFromSizeMasterModel = async (size_system, size_value) => {
    return db.query(`SELECT id FROM tbl_size_master WHERE size_system=? AND size_value=? AND is_active=1`, [size_system, size_value]);
};

export const fetchProductVariantModel = async (product_id, color_id, size_id) => {
    return db.query(`SELECT id, stock_quantity FROM tbl_product_variants WHERE pid = ? AND color_id = ? AND size_id = ?`, [product_id, color_id, size_id])
};

export const checkAllredyInTheCartOrNot = async (user_id, product_id, variant_id) => {
    return db.query(`SELECT * FROM tbl_users_cart WHERE user_id = ? AND pId = ? AND variant_id = ?`, [user_id, product_id, variant_id]);
};

export const addToCartWithVarient = async (user_id, product_id, variant_id, qty) => {
    return db.query(`INSERT INTO tbl_users_cart (pId, user_id, variant_id, quantity) VALUES (?, ?, ?, ?)`, [product_id, user_id, variant_id, qty]);
};

export const deleteProductVariantsByColorId = async (pid, color_id) => {
    return db.query(
        `DELETE FROM tbl_product_variants WHERE pid=? AND color_id=?`,
        [pid, color_id]
    );
};

export const deleteProductImagesByColorId = async (color_id) => {
    return db.query(
        `DELETE FROM tbl_productimg WHERE color_id=?`,
        [color_id]
    );
};

export const deleteProductColorById = async (color_id) => {
    return db.query(
        `DELETE FROM tbl_product_colors WHERE id=?`,
        [color_id]
    );
};


export const fetchLowProductStock = async (ID) => {
    return db.query(
        `Select * from tbl_products 
         JOIN tbl_product_variants ON tbl_product_variants.pid=tbl_products.pId 
         WHERE tbl_products.seller_id = ? AND tbl_products.status = 0  AND tbl_product_variants.stock_quantity <= tbl_product_variants.low_stock_alert AND tbl_product_variants.stock_quantity >=1
         ORDER BY tbl_products.created_at DESC
         `, [ID]
    )
};

export const fetchOutOfStockProductsModel = async (ID) => {
    return db.query(
        `Select * from tbl_products 
         JOIN tbl_product_variants ON tbl_product_variants.pid=tbl_products.pId 
         WHERE tbl_products.seller_id = ? AND tbl_products.status = 0  AND tbl_product_variants.stock_quantity = 0 
         ORDER BY tbl_products.created_at DESC
         `, [ID]
    )
};

export const fetchLowStockProductVariantsByPid = async (productId, color_id, size_id) => {
    return db.query(`SELECT v.stock_quantity, v.low_stock_alert,s.size_system,s.size_value,s.fit_type,s.id AS size_id
                     FROM tbl_product_variants v
                     JOIN tbl_size_master s ON s.id = v.size_id
                      WHERE v.pid = ? AND v.color_id = ? AND v.size_id = ? `, [productId, color_id, size_id]);
}

export const fetchIsProductStockOrNot = async (ID) => {
    return db.query(
        `Select * from tbl_product_variants WHERE pid = ?  AND stock_quantity >= 1`, [ID]
    )
};


export const fetchSellerPayoutBySellerId = async (sellerId) => {
    return db.query(`
    SELECT 
      seller_id,
      COALESCE(SUM(payout_amount), 0) AS total_payout
    FROM tbl_seller_payout
    WHERE seller_id = ?
      AND payout_status = 'COMPLETED'
    GROUP BY seller_id
  `, [sellerId]);
};


export const fetchOrdersBySellerId = async (ID) => {
    return db.query(`
      SELECT DISTINCT o.id
      FROM tbl_order_items oi
      JOIN tbl_products p ON oi.product_id = p.pId
      JOIN tbl_orders o ON o.id = oi.order_id
      WHERE p.seller_id = ?
    `, [ID]);
};

export const getSellerGrossEarningsModel = async (ID) => {
    return db.query(`SELECT 
  IFNULL(SUM(
    (oi.price_at_order * oi.quantity) + oi.delivery_charge
  ), 0) AS gross_earnings
FROM tbl_order_items oi
JOIN tbl_products p ON p.pId = oi.product_id
WHERE p.seller_id = ?
  AND oi.status = 1`, [ID]);
};

export const getSellerNetEarningsModel = async (sellerId) => {
    return db.query(`
    SELECT 
      IFNULL(SUM(payout_amount), 0) AS net_earnings
    FROM tbl_seller_payout
    WHERE seller_id = ?
      AND payout_status = 'completed'
  `, [sellerId]);
};

export const getSellerCommissionPaidModel = async (sellerId) => {
    return db.query(`
    SELECT 
      IFNULL(SUM(admin_commission), 0) AS total_commission
    FROM tbl_seller_payout
    WHERE seller_id = ?
      AND payout_status = 'completed'
  `, [sellerId]);
};

// export const getSellerTotalGrossModel = async (sellerId) => {
//   return db.query(`
//     SELECT COALESCE(SUM(gross_amount), 0) AS total_gross
//     FROM tbl_seller_payout
//     WHERE seller_id = ?
//   `, [sellerId]);
// };


export const getSellerPaidAmountModel = async (sellerId) => {
    return db.query(`
    SELECT 
      IFNULL(SUM(payout_amount), 0) AS paid
    FROM tbl_seller_payout
    WHERE seller_id = ?
      AND payout_status = 'completed'
  `, [sellerId]);
};

export const getSellerTotalGrossModel = async (sellerId) => {
    return db.query(`
    SELECT 
  COALESCE(SUM(oi.price_at_order * oi.quantity + oi.delivery_charge), 0) AS gross_earning
FROM tbl_order_items oi
JOIN tbl_products p ON p.pId = oi.product_id
WHERE p.seller_id = ?`, [sellerId]);
};

export const getSellerTotalReceivedModel = async (sellerId) => {
    return db.query(`
    SELECT 
  COALESCE(SUM(payout_amount), 0) AS received_amount
FROM tbl_seller_payout
WHERE seller_id = ?
AND payout_status = 'completed'
  `, [sellerId]);
};


export const getSellerPayoutListModel = async (sellerId) => {
    return db.query(`
  SELECT 
  payout_amount,
  admin_commission,
  gross_amount,
  payout_status,
  stripe_transfer_id,
  createdAt
FROM tbl_seller_payout
WHERE seller_id = ?
ORDER BY createdAt DESC;
  `, [sellerId]);
};

export const getProductVariantByPidAndColor = async (pid, color_id, size_id) => {
    return db.query(
        `SELECT id FROM tbl_product_variants WHERE pid = ? AND color_id = ? AND size_id=?`,
        [pid, color_id, size_id]
    );
};

export const updateProductVariantStockModel = async ({
    pid,
    color_id,
    stock_quantity,
    size_id
}) => {
    return db.query(
        `UPDATE tbl_product_variants
     SET stock_quantity = ?
     WHERE pid = ? AND color_id = ? AND size_id=?`,
        [stock_quantity, pid, color_id, size_id]
    );
};

export const getInventoryDataCountModel = async (sellerId) => {
    return db.query(`
    SELECT
      COUNT(DISTINCT p.pId) AS product_count,

      IFNULL(SUM(v.stock_quantity), 0) AS total_stock,

      SUM(
        CASE 
          WHEN v.pid IS NULL OR v.stock_quantity = 0 
          THEN 1 
          ELSE 0 
        END
      ) AS out_of_stock_count,

      SUM(
        CASE 
          WHEN v.stock_quantity > 0 
          AND v.stock_quantity <= IFNULL(v.low_stock_alert, 0)
          THEN 1 
          ELSE 0 
        END
      ) AS low_stock_count

    FROM tbl_products p
    LEFT JOIN tbl_product_variants v ON v.pid = p.pId
    WHERE p.seller_id = ?
      AND p.status = 0
  `, [sellerId]);
};

export const fetchAllColorModel = async () => {
    return db.query(`SELECT *
FROM tbl_colors
WHERE is_active = 1
AND color_name IN (
  'Black',
  'White',
  'Grey',
  'Charcoal',
  'Brown',
  'Dark Brown',
  'Light Brown',
  'Tan',
  'Camel',
  'Beige',
  'Cream',
  'Navy',
  'Blue',
  'Red',
  'Maroon',
  'Burgundy',
  'Olive',
  'Green'
)
ORDER BY FIELD(
  color_name,
  'Black',
  'Brown',
  'Dark Brown',
  'Tan',
  'White',
  'Grey',
  'Navy',
  'Blue',
  'Beige',
  'Cream',
  'Red',
  'Maroon',
  'Burgundy',
  'Olive',
  'Green'
)
`);
};

// ----------------------------------------new flow end--------------------------------------------------//

export const deleteAllProductVariants = async (pid) => {
    return db.query(`DELETE FROM tbl_product_variants WHERE pid=? `, [pid]);
};

export const fetchColorIdByPidAndColorName = async (pid) => {
    return db.query(`SELECT id FROM tbl_product_colors WHERE pid = ? AND color_name = ? `,
        [pid, 'DEFAULT']);
};

export const isProductIsAllreadyAddedToCart = async (variant_id, user_id) => {
    return db.query(`SELECT * FROM tbl_users_cart WHERE variant_id = ? AND user_id = ? `,
        [variant_id, user_id]);
};

export const updateProductVariantByIdStockModel = async (product_id, color_id, stock_quantity, low_stock, size_id) => {
    return db.query(
        `UPDATE tbl_product_variants
     SET stock_quantity = ? , low_stock_alert = ?
     WHERE pid = ? AND color_id = ? AND size_id=?`,
        [stock_quantity, low_stock, product_id, color_id, size_id]
    );
};
/**========================model end========================= */