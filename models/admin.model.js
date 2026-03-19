import db from "../config/db.js";

// --------------------------------contact supports api---------------------------------//

export const fetchAllContactSupports = async () => {
  return db.query("SELECT * FROM tbl_contact_support");
};

export const fetchTermsAndConditions = async () => {
  return db.query(
    "SELECT * FROM tbl_content_management WHERE content_type = ?",
    ["terms_and_service"]
  );
};

export const fetchPrivacyPolicy = async () => {
  return db.query(
    "SELECT * FROM tbl_content_management WHERE content_type = ?",
    ["privacy_policy"]
  );
};

export const get_admin_data_by_email = async (email) => {
  try {
    return await db.query(`SELECT * FROM tbl_admin WHERE email = ?`, [email]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch user data.");
  }
};

export const get_admin_data_by_id = async (admin_id) => {
  try {
    return await db.query(`SELECT * FROM tbl_admin WHERE id = ?`, [admin_id]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch user data.");
  }
};

export const get_user_data_by_id = async (user_id) => {
  try {
    return await db.query(`SELECT * FROM tbl_users WHERE id = ?`, [user_id]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch user data.");
  }
};

export const update_admin_data = async (
  reset_password_token,
  reset_password_token_expiry,
  email
) => {
  try {
    return await db.query(
      "UPDATE tbl_admin SET reset_password_token = ?, reset_password_token_expiry = ? WHERE email = ?",
      [reset_password_token, reset_password_token_expiry, email]
    );
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to update admin data");
  }
};

export const update_admin_password = async (
  hashedPassword,
  newPassword,
  admin_id
) => {
  try {
    return await db.query(
      `UPDATE tbl_admin SET password = ?, show_password = ? WHERE id = ?`,
      [hashedPassword, newPassword, admin_id]
    );
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to update admin data");
  }
};

export const update_admin_profile = async (
  full_name,
  profile_image,
  mobile_number,
  admin_commission,
  admin_id
) => {
  try {
    return await db.query(
      `UPDATE tbl_admin SET full_name = ?, profile_image = ?, mobile_number =?,admin_commission=?  WHERE id = ?`,
      [full_name, profile_image, mobile_number, admin_commission, admin_id]
    );
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to update admin data");
  }
};

export const get_user_data_by_email = async (email) => {
  try {
    return await db.query(`SELECT * FROM tbl_users WHERE email = ?`, [email]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch user data.");
  }
};

export const get_admin_data_by = async (token) => {
  try {
    return await db.query(
      `SELECT * FROM tbl_admin WHERE reset_password_token = ? AND reset_password_token_expiry > ?`,
      [token, new Date()]
    );
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch admin data.");
  }
};

export const update_admin_data_by = async (
  hashedPassword,
  newPassword,
  admin_id
) => {
  try {
    return await db.query(
      `UPDATE tbl_admin SET password = ?, show_password = ?, reset_password_token = NULL, reset_password_token_expiry = NULL WHERE id = ?`,
      [hashedPassword, newPassword, admin_id]
    );
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to update admin data.");
  }
};

export const get_seller_data_by_id = async (seller_id) => {
  try {
    return await db.query(`SELECT * FROM tbl_sellers WHERE id = ?`, [
      seller_id,
    ]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch user data.");
  }
};

export const get_all_user_data = async () => {
  try {
    return await db.query(`SELECT * FROM tbl_users ORDER BY id DESC`);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch user data.");
  }
};

export const suspend_unsuspend_user_model = async (user_id, user_status) => {
  try {
    return await db.query(
      `UPDATE tbl_users SET is_suspended = ?  WHERE id = ?`,
      [user_status, user_id]
    );
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch user data.");
  }
};

export const active_inactive_seller_model = async (seller_id, status) => {
  try {
    return await db.query(`UPDATE tbl_sellers SET status = ?  WHERE id = ?`, [
      status,
      seller_id,
    ]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to update active inactive seller.");
  }
};

// export const get_all_seller_data = async (APP_url) => {
//     try {
//         const query = `
//             SELECT
//     s.id AS seller_id,
//     s.*,
//     u.id as user_id,
//     u.fullName as full_name,
//     u.userName as userName,
//     u.bio as bio,
//     u.huntingTitle as huntingTitle,
//     u.isVerified as isVerified,
//     -- Business Logo
//     CASE
//         WHEN s.bussinesslogo IS NULL OR s.bussinesslogo LIKE 'http%' THEN s.bussinesslogo
//         ELSE CONCAT(?, s.bussinesslogo)
//     END AS bussiness_logo,
//     -- Profile Image
//     CASE
//         WHEN u.profileImage IS NULL OR u.profileImage LIKE 'http%' THEN u.profileImage
//         ELSE CONCAT(?, u.profileImage)
//     END AS profileImage,
//     -- Background Image
//     CASE
//         WHEN u.backgroundImage IS NULL OR u.backgroundImage LIKE 'http%' THEN u.backgroundImage
//         ELSE CONCAT(?, u.backgroundImage)
//     END AS backgroundImage,
//     COUNT(p.pId) AS total_products,
//     COALESCE(SUM(p.stock_quantity), 0) AS total_sales,
//     COALESCE(SUM(CAST(p.final_price AS DECIMAL(10,2)) * p.stock_quantity), 0) AS total_earnings,
//     CASE
//         WHEN COUNT(p.pId) = 0 THEN '[]'
//        ELSE
//     GROUP_CONCAT(
//         JSON_OBJECT(
//             'product_id', p.pId,
//             'product_name', p.product_name,
//             'category', p.product_category,
//             'description', p.product_description,
//             'base_price', p.base_price,
//             'discount', p.discount,
//             'final_price', p.final_price,
//             'stock_quantity', p.stock_quantity,
//             'low_stock_alert', p.low_stock_alert,
//             'shipping_charges', p.shipping_charges,
//             'free_shipping', p.free_shipping,
//             'status', p.status,
//             'is_active', p.is_active,
//             'created_at', p.created_at,
//             'updated_at', p.updated_at,
//             'total_sales', COALESCE(p.stock_quantity, 0),
//             'total_earnings', COALESCE(CAST(p.final_price AS DECIMAL(10,2)) * p.stock_quantity, 0)
//         ) SEPARATOR ','
//     )
// END AS products
// FROM tbl_sellers s
// LEFT JOIN tbl_users u ON s.userId = u.id
// LEFT JOIN tbl_products p ON s.id = p.seller_id
// GROUP BY s.id, u.id;
// `
//         ;

//         const results = await db.query(query, [APP_url, APP_url, APP_url]);

//         return results.map(seller => ({
//             ...seller,
//             user: {
//                 user_id: seller.userId,
//                 full_name: seller.full_name,
//                 userName: seller.userName,
//                 bio: seller.bio,
//                 profileImage: seller.profileImage,
//                 backgroundImage: seller.backgroundImage,
//                 huntingTitle: seller.huntingTitle,
//                 isVerified: seller.isVerified,
//             },
//             products: seller.products
//                 ? seller.products.split('||')
//                     .map(product => JSON.parse(product))
//                     .filter(product => Object.keys(product).length > 0)
//                 : []

//         }));

//     } catch (error) {
//         console.error("Database Error:", error.message);
//         throw new Error("Failed to fetch seller data.");
//     }
// };

export const get_all_seller_data = async (APP_url) => {
  try {
    const query = `
           SELECT 
    s.id AS seller_id, 
    s.*, 
    u.id AS user_id, 
    u.fullName AS full_name,
    u.userName AS userName,
    u.address AS address,
    u.bio AS bio,
    u.huntingTitle AS huntingTitle,
    u.isVerified AS isVerified,
    
    -- Business Logo
    CASE 
        WHEN s.bussinesslogo IS NULL OR s.bussinesslogo LIKE 'http%' THEN s.bussinesslogo 
        ELSE CONCAT(?, s.bussinesslogo) 
    END AS bussiness_logo,
    
    -- Profile Image
    CASE 
        WHEN u.profileImage IS NULL OR u.profileImage LIKE 'http%' THEN u.profileImage 
        ELSE CONCAT(?, u.profileImage) 
    END AS profileImage,
    
    -- Background Image
    CASE 
        WHEN u.backgroundImage IS NULL OR u.backgroundImage LIKE 'http%' THEN u.backgroundImage 
        ELSE CONCAT(?, u.backgroundImage) 
    END AS backgroundImage,
    
    COUNT(p.pId) AS total_products,
    COALESCE(SUM(p.stock_quantity), 0) AS total_sales,
    COALESCE(SUM(CAST(p.final_price AS DECIMAL(10,2)) * p.stock_quantity), 0) AS total_earnings,

    -- Products JSON String (excluding product images)
    CASE 
        WHEN COUNT(p.pId) = 0 THEN '[]'
        ELSE CONCAT('[', GROUP_CONCAT(
            DISTINCT JSON_OBJECT(
                'product_id', p.pId,
                'product_name', p.product_name,
                'seller_name', u.userName,
                'category', p.product_category,
                'description', p.product_description,
                'product_description', p.product_description,
                'base_price', p.base_price,
                'discount', p.discount,
                'final_price', p.final_price,
                'stock_quantity', p.stock_quantity,
                'low_stock_alert', p.low_stock_alert,
                'shipping_charges', p.shipping_charges,
                'free_shipping', p.free_shipping,
                'status', p.status,
                'is_active', p.is_active,
                'created_at', p.created_at,
                'updated_at', p.updated_at,
                'total_sales', COALESCE(p.stock_quantity, 0),
                'total_earnings', COALESCE(CAST(p.final_price AS DECIMAL(10,2)) * p.stock_quantity, 0)
            )
        ), ']') 
    END AS products
FROM tbl_sellers s
LEFT JOIN tbl_users u ON s.userId = u.id
LEFT JOIN tbl_products p ON s.id = p.seller_id
GROUP BY s.id, u.id
ORDER BY createdAt DESC;
        `;

    const results = await db.query(query, [APP_url, APP_url, APP_url]);

    const productImageQuery = `
        SELECT pI.pId AS product_id, 
               CASE 
                    WHEN pI.pImage IS NULL OR pI.pImage LIKE 'http%' THEN pI.pImage 
                    ELSE CONCAT(?, pI.pImage) 
               END AS pImage
        FROM tbl_productImg pI
    `;
    const productImages = await db.query(productImageQuery, [APP_url]);

    const product_category_name = `
          SELECT pC.id AS category_id, pC.category_name
    FROM tbl_product_category pC
    `;
    const product_category_fetch = await db.query(product_category_name);

    const categoryMap = product_category_fetch.reduce((acc, category) => {
      if (!acc[category.category_id]) acc[category.category_id] = [];
      acc[category.category_id].push(category.category_name);
      return acc;
    }, {});

    const imagesMap = productImages.reduce((acc, img) => {
      if (!acc[img.product_id]) acc[img.product_id] = [];
      acc[img.product_id].push(img.pImage);
      return acc;
    }, {});

    return results.map((seller) => ({
      ...seller,
      user: {
        user_id: seller.user_id,
        full_name: seller.full_name,
        userName: seller.userName,
        bio: seller.bio,
        profileImage: seller.profileImage,
        backgroundImage: seller.backgroundImage,
        huntingTitle: seller.huntingTitle,
        isVerified: seller.isVerified,
      },
      // products: seller.products ? JSON.parse(seller.products) : seller.products
      products: seller.products
        ? JSON.parse(seller.products).map((product) => ({
          ...product,
          productImages: imagesMap[product.product_id] || [],
          category_name: categoryMap[product.category][0] || null,
        }))
        : [],
    }));
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch seller data.");
  }
};

export const approved_reject_seller_request_model = async (
  seller_id,
  rejected_at,
  approve_status
) => {
  try {
    return await db.query(
      `UPDATE tbl_sellers SET isApproved = ?, rejected_at = ?  WHERE id = ?`,
      [approve_status, rejected_at, seller_id]
    );
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch user data.");
  }
};

export const get_all_posts = async () => {
  try {
    const query = `
            SELECT 
                p.id AS post_id,
                p.postName,
                p.videoUrl,
                p.imageUrl,
                p.captions,
                p.hasTags,
                p.location AS post_location,
                p.tagPeople,
                p.audiance,
                p.mediaType,
                p.status AS post_status,
                p.createdAt AS post_created_at,
                p.updatedAt AS post_updated_at,

                u.id AS user_id,
                u.userName,
                u.email,
                u.fullName,
                u.profileImage,
                u.location AS user_location,
                u.isVerified,
                u.status AS user_status,

                -- Count Total Likes for Each Post
                (SELECT COUNT(*) FROM tbl_userslike ul WHERE ul.postId = p.id) AS total_likes,

                -- Count Total Views for Each Post
                (SELECT COUNT(*) FROM tbl_userviewspost uv WHERE uv.postId = p.id) AS total_views,

                -- Count Total Comments for Each Post
                (SELECT COUNT(*) FROM tbl_userscomment uc WHERE uc.postId = p.id) AS total_comments

            FROM tbl_mypost p
            LEFT JOIN tbl_users u ON p.userId = u.id
            ORDER BY p.createdAt DESC;
        `;

    return await db.query(query);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch posts.");
  }
};

export const get_post_by_id = async (post_id) => {
  try {
    const query = `
            SELECT *
            FROM tbl_mypost WHERE id = ?
        `;
    return await db.query(query, [post_id]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch posts.");
  }
};

export const delete_post_by_id = async (post_id) => {
  try {
    const query = `
            DELETE FROM tbl_mypost WHERE id = ?
        `;
    return await db.query(query, [post_id]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to DELETE post.");
  }
};

export const get_all_product_data = async () => {
  try {
    const query = `
            SELECT 
                p.*, 
                s.*, 
                pc.*,
                u.userName as seller_name
            FROM tbl_products p
            LEFT JOIN tbl_sellers s ON p.seller_id = s.id
            LEFT JOIN tbl_users u ON s.userId = u.id
            LEFT JOIN tbl_product_category pc ON p.product_category = pc.id
            WHERE p.status = 0
            ORDER BY p.created_at DESC
        `;

    return await db.query(query);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch product data.");
  }
};

export const delete_product_by_id = async (ID) => {
  return db.query("UPDATE tbl_products SET status = 1 WHERE pId = ?", [ID]);
};


export const get_product_data_by_id = async (product_id) => {
  try {
    const query = `
            SELECT * FROM tbl_products WHERE pId = ?
        `;
    return await db.query(query, [product_id]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to DELETE Product.");
  }
};

export const get_all_supports = async () => {
  try {
    const query = `
            SELECT *
            FROM tbl_usersupport
            ORDER BY createdAt DESC; 
        `;
    return await db.query(query);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch supports.");
  }
};

export const get_support_by_id = async (support_id) => {
  try {
    const query = `
            SELECT *
            FROM tbl_usersupport
           WHERE id = ?; 
        `;
    return await db.query(query, [support_id]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch supports.");
  }
};

export const get_support_reply = async (email) => {
  try {
    const query = `
            SELECT *
            FROM tbl_support_reply
           WHERE email = ?; 
        `;
    return await db.query(query, [email]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch supports.");
  }
};

export const insert_support_reply = async (reply_message, email) => {
  try {
    const query = `
            INSERT INTO tbl_support_reply (reply_message, email)
            VALUES (?, ?)
        `;
    return await db.query(query, [reply_message, email]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to insert support reply.");
  }
};

export const mark_as_resolved_support = async (support_id) => {
  try {
    const query = `
            UPDATE tbl_usersupport
            SET is_resolved = true
           WHERE id = ?; 
        `;
    return await db.query(query, [support_id]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to mark as resolved.");
  }
};

export const get_dashbaord_data = async () => {
  try {
    const query = `
            SELECT 
                (SELECT SUM(final_price) FROM tbl_products) AS total_revenue,
                (SELECT COUNT(*) FROM tbl_products) AS total_sales,
                (SELECT COUNT(*) FROM tbl_users) AS total_users,
                (SELECT COUNT(*) FROM tbl_sellers WHERE isApproved = '1' ) AS total_sellers;
        `;
    return await db.query(query);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch supports.");
  }
};

export const getSellerProducts = async (sellerId, userName) => {
  const query = `
        SELECT 
            p.pId AS product_id,
            p.product_name,
            ? AS seller_name,
            p.product_category AS category,
            p.product_description,
            p.base_price,
            p.discount,
            p.final_price,
            p.stock_quantity,
            p.low_stock_alert,
            p.shipping_charges,
            p.free_shipping,
            p.status,
            p.is_active,
            p.created_at,
            p.updated_at,
            COALESCE(0) AS total_sales,
            COALESCE(0) AS total_earnings
        FROM tbl_products p
        LEFT JOIN tbl_users u ON p.seller_id = u.id
        WHERE p.seller_id = ? AND p.status = 0;
    `;
  const results = await db.query(query, [userName, sellerId]);
  return results;
};

export const getSellerProfuctQuantity = async (product_id) => {
  const query = `SELECT 
    product_id,
    COALESCE(SUM(quantity), 0) AS total_quantity,
    COALESCE(MAX(price_at_order), 0) AS price_at_order,
    COALESCE(SUM(quantity * price_at_order + delivery_charge), 0) AS total_earnings
FROM 
    tbl_order_items
WHERE 
    product_id = ?
GROUP BY 
    product_id`;
  const results = await db.query(query, [product_id]);
  return results;
};

export const getProductCategories = async () => {
  const query = `SELECT id, category_name FROM tbl_product_category`;
  const results = await db.query(query);
  return results;
};

export const getProductImages = async (APP_URL) => {
  const query = `
        SELECT pI.pId AS product_id, 
               CASE 
                    WHEN pI.pImage IS NULL OR pI.pImage LIKE 'http%' THEN pI.pImage 
                    ELSE CONCAT(?, pI.pImage) 
               END AS pImage
        FROM tbl_productImg pI
    `;
  const results = await db.query(query, [APP_URL]);
  return results;
};

export const getAllSellers = async (APP_URL) => {
  const query = `
        SELECT 
            s.id AS seller_id, 
            s.*, 
            u.id AS user_id, 
            u.fullName AS full_name,
            u.userName AS userName,
            u.address AS address,
            u.bio AS bio,
            u.huntingTitle AS huntingTitle,
            u.isVerified AS isVerified,
            CASE 
                WHEN s.bussinesslogo IS NULL OR s.bussinesslogo LIKE 'http%' THEN s.bussinesslogo 
                ELSE CONCAT(?, s.bussinesslogo) 
            END AS bussiness_logo,
            CASE 
                WHEN u.profileImage IS NULL OR u.profileImage LIKE 'http%' THEN u.profileImage 
                ELSE CONCAT(?, u.profileImage) 
            END AS profileImage,
            CASE 
                WHEN u.backgroundImage IS NULL OR u.backgroundImage LIKE 'http%' THEN u.backgroundImage 
                ELSE CONCAT(?, u.backgroundImage) 
            END AS backgroundImage
        FROM tbl_sellers s
        LEFT JOIN tbl_users u ON s.userId = u.id
        ORDER BY s.createdAt DESC;
    `;
  const results = await db.query(query, [APP_URL, APP_URL, APP_URL]);
  return results;
};

export const fetchSellerIds = async (id) => {
  return db.query("SELECT * FROM tbl_sellers WHERE id=? ", [id]);
};

export const fetchProductDetailedById = async (id) => {
  return db.query(
    `SELECT p.* FROM tbl_sellers s
        JOIN tbl_products p ON s.id = p.seller_id
    WHERE p.seller_id = ? AND p.status = 0 `,
    [id]
  );
};

export const updateAdminFcmToken = async (fcmToken, admin_id) => {
  return await db.query(`UPDATE tbl_admin SET fcmToken = ? WHERE id = ?`, [
    fcmToken,
    admin_id,
  ]);
};

export const fetchAdminNotificationById = async (id) => {
  return db.query(
    "SELECT * FROM tbl_notification WHERE sendTo = ? AND isSendTo = 1  ORDER BY createdAt DESC",
    [id]
  );
};

export const get_group_data_chat = async () => {
  try {
    const query = `
            SELECT *
            FROM chat
            WHERE is_group = 1
            ORDER BY createdAt DESC; 
        `;
    return await db.query(query);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch supports.");
  }
};

export const get_all_content = async () => {
  try {
    const query = `
            SELECT *
            FROM  tbl_content_management
        `;
    return await db.query(query);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch Content Management.");
  }
};

export const contentManagementfindOneBy = async (content_management_id) => {
  try {
    const query = `
            SELECT *
            FROM  tbl_content_management WHERE content_management_id = ?
        `;
    return await db.query(query, [content_management_id]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch Content Management.");
  }
};

export const update_content = async (
  content,
  content_type,
  content_management_id
) => {
  try {
    return await db.query(
      "UPDATE tbl_content_management SET content = ?, content_type = ? WHERE content_management_id = ?",
      [content, content_type, content_management_id]
    );
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to update admin data");
  }
};

export const insert_sweepstake_data = async (
  sweepstakes_name,
  start_date,
  end_date,
  description,
  entry_price,
  attachment,
  winningPrice
) => {
  try {
    return await db.query(
      `INSERT INTO tbl_sweepstakes 
            (sweepstakes_name, start_date, end_date, description, entry_price, attachment,winningPrice) 
            VALUES (?, ?, ?, ?, ?, ?,?)`,
      [
        sweepstakes_name,
        start_date,
        end_date,
        description,
        entry_price,
        attachment,
        winningPrice,
      ]
    );
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to update admin data");
  }
};

export const fetch_all_sweepstakes = async () => {
  const rows = await db.query(`
        SELECT 
            tbl_sweepstakes.*, 
            COALESCE(SUM(us.entryAmount), 0) AS revenue,  
            COUNT(DISTINCT us.user_id) AS participants
        FROM tbl_sweepstakes
        LEFT JOIN tbl_users_sweepstacks us 
            ON tbl_sweepstakes.sweepstakes_id = us.sweepStacksId
        GROUP BY tbl_sweepstakes.sweepstakes_id
        ORDER BY start_date DESC
    `);
  return rows;
};

export const fetch_sweepstakes_by_id = async (sweepstakes_id) => {
  try {
    const rows = await db.query(
      `SELECT * FROM tbl_sweepstakes WHERE sweepstakes_id= ?`,
      [sweepstakes_id]
    );
    return rows;
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch sweepstakes data");
  }
};

export const update_sweepstake_data = async (
  sweepstakes_id,
  sweepstakes_name,
  start_date,
  end_date,
  description,
  entry_price,
  winningPrice
) => {
  try {
    const fields = [
      "sweepstakes_name = ?",
      "start_date = ?",
      "end_date = ?",
      "description = ?",
      "entry_price = ?",
      "winningPrice = ?",
    ];
    const values = [
      sweepstakes_name,
      start_date,
      end_date,
      description,
      entry_price,
      winningPrice,
    ];

    // if (attachment) {
    //     fields.push('attachment = ?');
    //     values.push(attachment);
    // }

    values.push(sweepstakes_id);

    const query = `UPDATE tbl_sweepstakes SET ${fields.join(
      ", "
    )} WHERE sweepstakes_id = ?`;
    return await db.query(query, values);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to update sweepstake data");
  }
};

export const delete_sweepstake_data = async (sweepstakes_id) => {
  try {
    return await db.query(
      `DELETE FROM tbl_sweepstakes WHERE sweepstakes_id= ?`,
      [sweepstakes_id]
    );
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to delete sweepstake data");
  }
};

export const updateSweepstacksStatus = async (id) => {
  try {
    return await db.query(
      "UPDATE tbl_sweepstakes SET isActive = 0 WHERE sweepstakes_id= ?",
      [id]
    );
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to update admin data");
  }
};

export const modelFetchAllUserOrders = async () => {
  return db.query(`SELECT tbl_orders.*,tbl_orders.createdAt AS order_date,u.fullName,u.email FROM tbl_orders 
         LEFT JOIN tbl_users u ON tbl_orders.userId = u.id
        ORDER BY tbl_orders.createdAt DESC `);
};

export const modelFetchOrdersByOrderId = async (id) => {
  return db.query(
    `SELECT tbl_orders.*,tbl_orders.createdAt AS order_date,u.fullName,u.email,os.shipping_price
         FROM tbl_orders 
         JOIN tbl_users u ON tbl_orders.userId = u.id
         JOIN tbl_order_summary os ON os.id = tbl_orders.order_summaryId
         Where tbl_orders.id=?
        ORDER BY tbl_orders.createdAt DESC `,
    [id]
  );
};

// export const fetchOrderItemByID = async (id) => {
//     return db.query(`SELECT tbl_order_items.*,p.product_name,p.shipping_charges AS shippingCharge FROM tbl_order_items
//         JOIN tbl_products p ON tbl_order_items.product_id = p.pId
//         Where order_id=?`, [id]);
// };

// export const fetchOrderItemByID = async (id) => {
//   return db.query(
//     `
//         SELECT 
//             tbl_order_items.*, 
//             p.product_name, 
//             p.seller_id, 
//             p.shipping_charges AS shippingCharge,
//             (SELECT SUM(quantity * price_at_order) 
//              FROM tbl_order_items 
//              WHERE order_id = ?) AS totalAmount
//         FROM tbl_order_items 
//         JOIN tbl_products p ON tbl_order_items.product_id = p.pId
//         WHERE order_id = ?
//     `,
//     [id, id]
//   );
// };

export const fetchProductsImagesByProductId = async (id) => {
  return db.query(
    `SELECT * FROM tbl_productImg
        Where pId=?`,
    [id]
  );
};

export const insert_ads_data = async (data) => {
  return db.query("INSERT INTO tbl_ads SET ?", [data]);
};

export const fetchAllAds = async () => {
  return db.query(`SELECT * FROM tbl_ads ORDER BY createdAt DESC`);
};

export const fetch_UsersBysweepstakesid = async (id) => {
  try {
    const rows = await db.query(
      `SELECT tbl_users.*,tbl_users_sweepstacks.entryPack FROM tbl_users_sweepstacks 
            JOIN tbl_users ON tbl_users_sweepstacks.user_id=tbl_users.id
            WHERE sweepStacksId = ? ORDER BY tbl_users_sweepstacks.createdAt DESC`,
      [id]
    );
    return rows;
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch sweepstakes data");
  }
};

export const sweepstacksWinnersModel = async (data) => {
  return db.query("INSERT INTO tbl_sweepstacks_winners SET ?", [data]);
};

export const sumTotalRevenue = async () => {
  return db.query(
    `SELECT COUNT(userId) AS total_orders , SUM(totalAmount) AS total_revenue FROM tbl_orders`
  );
};

export const fetchSweepstacksWinnerUser = async (id) => {
  return db.query(
    `SELECT tbl_users.fullName,tbl_users.profileImage,tbl_users.email FROM tbl_sweepstacks_winners 
        JOIN tbl_users ON tbl_sweepstacks_winners.user_id=tbl_users.id
        WHERE tbl_sweepstacks_winners.sweepstack_id = ?`,
    [id]
  );
};

export const delete_ads_data = async (id) => {
  try {
    return await db.query(`DELETE FROM tbl_ads WHERE id= ?`, [id]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to delete sweepstake data");
  }
};

export const sumTotalSweepstacksAmount = async () => {
  return db.query(
    `SELECT SUM(entryAmount) AS sweepstacks_revenue FROM tbl_users_sweepstacks`
  );
};

export const sumTotalEnteries = async () => {
  return db.query(
    `SELECT SUM(totalEntry) AS Total_enteries FROM tbl_users_sweepstacks`
  );
};

export const sweepstacks_winners = async () => {
  return db.query(
    `SELECT COUNT(user_id) AS winners_announced FROM tbl_sweepstacks_winners`
  );
};

export const weeklyFilterRevenue = async () => {
  return db.query(`
        SELECT formattedDate AS date, totalRevenue
        FROM (
            SELECT 
                DATE(createdAt) AS createdDate,
                DATE_FORMAT(createdAt, '%d %b') AS formattedDate,
                SUM(totalAmount) AS totalRevenue
            FROM tbl_orders
            WHERE createdAt >= CURDATE() - INTERVAL 6 DAY AND paymentStatus = 1
            GROUP BY createdDate
        ) AS sub
        ORDER BY createdDate
    `);
};

export const monthlyFilterRevenue = async (year, month) => {
  return db.query(
    `
        SELECT formattedDate AS label, totalRevenue
        FROM (
            SELECT 
                DATE(createdAt) AS createdDate,
                DATE_FORMAT(createdAt, '%d %b') AS formattedDate,
                SUM(totalAmount) AS totalRevenue
            FROM tbl_orders
            WHERE YEAR(createdAt) = ? AND MONTH(createdAt) = ? AND paymentStatus = 1
            GROUP BY createdDate
        ) AS sub
        ORDER BY createdDate
    `,
    [year, month]
  );
};

export const yearlyFilterRevenue = async (year) => {
  return db.query(
    `
        SELECT 
            MONTH(createdAt) AS monthNumber,
            DATE_FORMAT(createdAt, '%b') AS label,
            SUM(totalAmount) AS totalRevenue
        FROM tbl_orders
        WHERE YEAR(createdAt) = ? AND paymentStatus = 1
        GROUP BY monthNumber, label
        ORDER BY monthNumber
    `,
    [year]
  );
};

export const updateProductQuantityModel = async (ID, quantity) => {
  return db.query("UPDATE tbl_products SET stock_quantity = ? WHERE pId = ?", [
    quantity,
    ID,
  ]);
};

export const fetchSweepstakesid = async (id) => {
  try {
    const rows = await db.query(
      `SELECT SUM(entryAmount) AS totalRevenue ,COUNT(user_id) AS totalParticipate FROM tbl_users_sweepstacks WHERE sweepStacksId = ? `,
      [id]
    );
    return rows;
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch sweepstakes data");
  }
};

export const updateSweepstackEndDateModel = async (
  sweepstack_id,
  currentDateTime
) => {
  return db.query(
    "UPDATE tbl_sweepstakes SET end_date = ? WHERE sweepstakes_id = ?",
    [currentDateTime, sweepstack_id]
  );
};

export const fetchuserEntryPackeges = async (id) => {
  try {
    const rows = await db.query(
      `SELECT entryPack,totalEntry,entryAmount FROM tbl_users_sweepstacks WHERE user_id = ? `,
      [id]
    );
    return rows;
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch sweepstakes data");
  }
};

export const fetchAdsById = async (ID) => {
  return db.query("select * from tbl_ads where id = ?", [ID]);
};

export const updateAdsInfo = async (updatedFields, id) => {
  const keys = Object.keys(updatedFields);
  const values = Object.values(updatedFields);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  values.push(id);
  const query = `UPDATE tbl_ads SET ${setClause} WHERE id = ?`;
  return db.query(query, values);
};

export const getAllProductData = async () => {
  return db.query("select * from tbl_products ");
};

// -------------------------------------new model------------------------------------------------//

export const insertSweepstacksMediaModel = async (data) => {
  return db.query("INSERT INTO tbl_sweepstacks_media SET ?", [data]);
};

export const fetch_sweepstakesMedia_by_id = async (sweepstakes_id) => {
  try {
    const rows = await db.query(
      `SELECT * FROM tbl_sweepstacks_media WHERE sweepstacksId= ?`,
      [sweepstakes_id]
    );
    return rows;
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch sweepstakes data");
  }
};

export const delete_Media_dataByIds = async (id) => {
  try {
    return await db.query(`DELETE FROM tbl_sweepstacks_media WHERE id= ?`, [
      id,
    ]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to delete sweepstake data");
  }
};

export const fetch_sweepstakesFile_by_id = async (id) => {
  try {
    const rows = await db.query(
      `SELECT * FROM tbl_sweepstacks_media WHERE id= ?`,
      [id]
    );
    return rows;
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch sweepstakes data");
  }
};

export const insertAdsMediaModel = async (data) => {
  return db.query("INSERT INTO tbl_ads_media SET ?", [data]);
};

export const fetch_adsMedia_by_id = async (id) => {
  return db.query(`SELECT * FROM tbl_ads_media WHERE ads_id= ?`, [id]);
};

export const delete_adsMediaByIds = async (id) => {
  try {
    return await db.query(`DELETE FROM tbl_ads_media WHERE id= ?`, [id]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to delete sweepstake data");
  }
};

export const fetchAdsMediaById = async (id) => {
  return db.query(`SELECT * FROM tbl_ads_media WHERE id = ?`, [id]);
};

// --------------------------------------working start--------------------------------------//

export const updateOrdersData = async (updatedFields, id) => {
  const keys = Object.keys(updatedFields);
  const values = Object.values(updatedFields);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  values.push(id);
  const query = `UPDATE tbl_ads SET ${setClause} WHERE id = ?`;
  return db.query(query, values);
};

// ----------------------------------------------Agremments----------------------------------------------//

export const fetchTermsAndConditionsModel = async (content_type) => {
  return db.query(
    `SELECT content_description ,content_type FROM tbl_content_management  WHERE content_type = ? `,
    [content_type]
  );
};

export const updateContentManagments = async (updatedFields, content_type) => {
  const keys = Object.keys(updatedFields);
  const values = Object.values(updatedFields);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  values.push(content_type);
  const query = `UPDATE tbl_content_management SET ${setClause} WHERE content_type = ?`;
  return db.query(query, values);
};

// Seller Payout //

export const getAllListOfSeller = async () => {
  return db.query(`SELECT * FROM tbl_sellers ORDER BY id DESC`);
};

export const getAllSellerPayoutListModel = async () => {
  return db.query(`
    SELECT *
    FROM tbl_seller_payout
    ORDER BY id DESC
    `);
};

export const updateSellerPayoutModel = async (Data) => {
  return db.query("INSERT into tbl_seller_payout set ?", [Data]);
};

export const editAudioByIdModel = async (updatedFields, id) => {
  const keys = Object.keys(updatedFields);
  const values = Object.values(updatedFields);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  values.push(id);
  const query = `UPDATE tbl_audio SET ${setClause} WHERE id = ?`;
  return db.query(query, values);
};

export const fetchAllAudioByIdModel = async (id) => {
  return db.query(`SELECT * FROM tbl_audio WHERE id = ? `, [id]);
};

export const fetchAllAudioModel = async () => {
  return db.query(`SELECT * FROM tbl_audio ORDER BY createdAt DESC`);
};

export const deleteAudioModel = async (ID) => {
  return db.query("DELETE FROM tbl_audio WHERE id= ?", [ID]);
};

// Update Admin Commission
export const updateAdminCommissionModel = async (Data, ID) => {
  return db.query(`UPDATE tbl_admin set ? WHERE id=?`, [Data, ID]);
};
export const isSellerAccountCreatedOrNot = async (id) => {
  return db.query("SELECT * FROM tbl_seller_account WHERE seller_id=? ", [id]);
};

// Wallet
export const getAdminWallet = async () => {
  return db.query(
    `SELECT oi.*, p.pId FROM tbl_order_items oi JOIN tbl_products p ON oi.product_id = p.pId`
  );
};

export const getAllProductActiveData = async () => {
  return db.query("select * from tbl_products  WHERE status = 0  ");
};

export const get_boosted_all_product_data = async () => {
  try {
    const query = `
            SELECT
                p.*,
                s.*,
                pi.pImage AS productImages,
                pc.*,
                u.userName as seller_name,
                pp.reach,pp.price,pp.duration_days,
                b.id as boosted_product_id,
                b.start_date,
                b.end_date,
                b.current_status
                FROM tbl_boost_product b
            JOIN tbl_products p ON b.product_id = p.pId
            LEFT JOIN tbl_sellers s ON p.seller_id = s.id
            LEFT JOIN tbl_users u ON s.userId = u.id
            LEFT JOIN tbl_productImg pi ON p.pId = pi.pId
            LEFT JOIN tbl_product_category pc ON p.product_category = pc.id
            JOIN tbl_promotion_packages pp ON pp.id = b.package_id
            ORDER BY b.created_at DESC
        `;
    return await db.query(query);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch product data.");
  }
};

export const get_boosted_view_count = async (boosted_product_id) => {
  try {
    const query = `
            SELECT COUNT(id) AS viewCount
FROM tbl_product_boost_analytics
WHERE boosted_product_id = ?;
        `;
    return await db.query(query, [boosted_product_id]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch product data.");
  }
};

export const fetchAllUsers = async (id) => {
  return db.query("SELECT * FROM tbl_users WHERE id != ? ", [id]);
};

export const fetchSweepstacksIds = async (id) => {
  return db.query("SELECT * FROM tbl_sweepstakes WHERE sweepstakes_id=? ", [
    id,
  ]);
};

export const productTotalSales = async (product_id, start_date, end_date) => {
  return db.query(
    "SELECT IFNULL(SUM(total_prices), 0) as total_sales FROM  tbl_order_summary WHERE orderItem LIKE CONCAT('%', ?, '%')  AND createdAt BETWEEN ? AND ?",
    [product_id, start_date, end_date]
  );
};

export const get_boosted_all_post_data = async () => {
  try {
    const query = `SELECT
                p.*,
                s.fullName,s.email,s.userName,s.profileImage,s.backgroundImage,
                pp.reach,pp.price,pp.duration_days,
                b.id as boosted_product_id,
                b.start_date,
                b.end_date,
                b.current_status
                FROM tbl_boost_post b
            JOIN tbl_mypost p ON b.post_id = p.id
            LEFT JOIN tbl_users s ON p.userId = s.id
            JOIN tbl_post_promotion_packages pp ON pp.id = b.plan_id
            ORDER BY b.created_at DESC;
        `;
    return await db.query(query);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch product data.");
  }
};

export const postViewsOnBoost = async (postId, start_date, end_date) => {
  return db.query(
    "SELECT IFNULL(COUNT(id ), 0) as total_views FROM  tbl_userviewspost WHERE postId = ?  AND createdAt BETWEEN ? AND ?",
    [postId, start_date, end_date]
  );
};

export const fetchPostPromotionalPackages = async () => {
  return db.query(`SELECT * FROM tbl_post_promotion_packages`);
};

export const fetchProductPromotionalPackages = async () => {
  return db.query(`SELECT * FROM tbl_promotion_packages`);
};

export const updatePostPromotionalPackages = async (Data, ID) => {
  return db.query(`UPDATE tbl_post_promotion_packages set ? WHERE id= ?`, [
    Data,
    ID,
  ]);
};

export const updateProductPromotionalPackages = async (Data, ID) => {
  return db.query(`UPDATE tbl_promotion_packages set ? WHERE id= ?`, [
    Data,
    ID,
  ]);
};

export const fetchLiveStream = async () => {
  return db.query(
    `SELECT l.*,u.* FROM tbl_live l JOIN tbl_users u ON u.id = l.user_id WHERE l.status = 1 ORDER BY l.created_at DESC`
  );
};

export const getLiveStreamViews = async (live_id) => {
  return db.query(
    `SELECT u.userName,u.email,u.fullName,u.profileImage FROM tbl_live_view l JOIN tbl_users u ON u.id = l.user_id	WHERE l.live_id = ?`,
    [live_id]
  );
};

export const fetchWalletHistoryByIds = async (id) => {
  return db.query(
    "SELECT * FROM tbl_wallet WHERE user_id = ? ORDER BY created_at DESC",
    [id]
  );
};

export const fetchWalletBalanceByIds = async (id) => {
  return db.query(
    "SELECT  IFNULL(SUM(CASE WHEN status = 0 THEN amount END), 0) AS creditedAmount,  IFNULL(SUM(CASE WHEN status = 1 THEN amount END), 0) AS debitedAmount,  IFNULL(SUM(CASE WHEN status = 0 THEN amount END), 0) - IFNULL(SUM(CASE WHEN status = 1 THEN amount END), 0) AS balance FROM tbl_wallet WHERE user_id = ? ",
    [id]
  );
};

export const fetchUserTranctionByThereId = async (userId) => {
  return db.query(
    `SELECT wallet_id, user_id, amount, status, transaction_id, description, created_at, updated_at 
             FROM tbl_wallet 
             WHERE user_id = ? 
             ORDER BY created_at DESC`,
    [userId]
  );
};

export const fetchCreditAndDebitOfParticularUsers = async (userId) => {
  return db.query(
    `SELECT 
                SUM(CASE WHEN status = 0 THEN amount ELSE 0 END) AS total_credit,
                SUM(CASE WHEN status = 1 THEN amount ELSE 0 END) AS total_debit
             FROM tbl_wallet 
             WHERE user_id = ?`,
    [userId]
  );
};

export const fetchAllUserTranctionHistory = async () => {
  return db.query(
    `SELECT wallet_id, user_id, amount, status, transaction_id, description, created_at, updated_at  FROM tbl_wallet ORDER BY created_at DESC`
  );
};

export const marketPlaceSell = async () => {
  return db.query(`SELECT *  FROM tbl_order_items `);
};

// -------------------------user apply to become a investor-------------------------------------//

export const fetchUserApplyToBecomeInvestorModel = async () => {
  return db.query(`SELECT * FROM investor_application`);
};

export const fetchUserApplyToBecomeInvestorMediaModel = async (investor_id) => {
  return db.query(
    `SELECT documents,investor_id FROM investor_media WHERE investor_id = ?`,
    [investor_id]
  );
};

export const approveUserApplyToBecomeInvestorModel = async (investor_id) => {
  return db.query(
    `UPDATE investor_application SET status = 1 WHERE user_id = ?`,
    [investor_id]
  );
};

export const rejectUserApplyToBecomeInvestorModel = async (investor_id) => {
  return db.query(
    `UPDATE investor_application SET status = 2 WHERE user_id = ?`,
    [investor_id]
  );
};

export const createRanchModel = async (data) => {
  return db.query("INSERT INTO ranches SET?", [data]);
};

export const insertRanchesMediaModel = async (data) => {
  return db.query("INSERT INTO ranch_images SET?", [data]);
};

export const fetchRanchesMediaModel = async (ranch_id) => {
  return db.query(
    `SELECT id,url,ranch_id FROM ranch_images WHERE ranch_id = ?`,
    [ranch_id]
  );
};

export const fetchRanchesModel = async () => {
  return db.query(
    `SELECT * FROM ranches WHERE isDeleted = 0 ORDER BY created_at DESC`
  );
};

export const fetchRanchesByIdModel = async (ranch_id) => {
  return db.query(`SELECT * FROM ranches WHERE id = ?`, [ranch_id]);
};

export const updateRanchesStatus = async (status, id) => {
  return db.query(`UPDATE ranches SET status = ? WHERE id = ?`, [status, id]);
};

export const deleteRanchesMediaById = async (id) => {
  return db.query(`UPDATE ranch_images SET isDeleted = 1 WHERE ranch_id = ?`, [
    id,
  ]);
};

export const updateRanchesModel = async (updatedFields, id) => {
  const keys = Object.keys(updatedFields);
  const values = Object.values(updatedFields);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  values.push(id);
  const query = `UPDATE ranches SET ${setClause} WHERE id = ?`;
  return db.query(query, values);
};

export const hardDeleteRanchesMedia = async (id) => {
  return db.query("DELETE FROM ranch_images WHERE ranch_id = ? ", [id]);
};

export const getAllInvestorApplications = async () => {
  return db.query(`SELECT
    ia.*,
    CONCAT(
        '[',
        GROUP_CONCAT(
            CONCAT(
                '{"id":', idoc.id,
                ',"fileType":"', idoc.fileType,
                '","files":"', idoc.files,
                '","created_at":"', idoc.created_at,
                '","updated_at":"', idoc.updated_at, '"}'
            )
            SEPARATOR ','
        ),
        ']'
    ) AS documents
FROM investor_application ia
LEFT JOIN investor_documents idoc
    ON idoc.investor_id = ia.id
GROUP BY ia.id
ORDER BY ia.created_at DESC`);
};

// export const getInvestorApplicationsById = async (id) => {
//   return db.query(
//     `SELECT
//         ia.*,
//         CONCAT(
//             '[',
//             GROUP_CONCAT(
//                 CONCAT(
//                     '{"id":', idoc.id,
//                     ',"fileType":"', idoc.fileType,
//                     '","files":"', idoc.files,
//                     '","created_at":"', idoc.created_at,
//                     '","updated_at":"', idoc.updated_at, '"}'
//                 )
//                 SEPARATOR ','
//             ),
//             ']'
//         ) AS documents
//      FROM investor_application ia
//      LEFT JOIN investor_documents idoc
//        ON idoc.investor_id = ia.id
//      WHERE ia.id = ?
//      GROUP BY ia.id
//      ORDER BY ia.created_at DESC`,
//     [id]
//   );
// };

export const getInvestorApplicationsById = async (id) => {
  return db.query(
    `SELECT
  ia.*,
  JSON_ARRAYAGG(
      JSON_OBJECT(
          'id', idoc.id,
          'fileType', idoc.fileType,
          'files', idoc.files,
          'created_at', idoc.created_at,
          'updated_at', idoc.updated_at
      )
  ) AS documents
FROM investor_application ia
LEFT JOIN investor_documents idoc
ON idoc.investor_id = ia.id
WHERE ia.id = ?
GROUP BY ia.id
ORDER BY ia.created_at DESC;
`,
    [id]
  );
};

export const softRanchesDeleted = async (id) => {
  return db.query("UPDATE ranches SET isDeleted = 1 WHERE id = ?", [id]);
};

export const insertRanchesDocuments = async (data) => {
  return db.query("INSERT INTO tbl_ranches_documents SET?", [data]);
};

export const fetchRanchesDocumentsModel = async (ranch_id) => {
  return db.query(`SELECT * FROM tbl_ranches_documents WHERE ranch_id = ?`, [
    ranch_id,
  ]);
};

export const deleteRanchesDocumentsById = async (id) => {
  return db.query(
    `UPDATE tbl_ranches_documents SET isDeleted = 1 WHERE ranch_id = ?`,
    [id]
  );
};


export const hardDeleteRanchesDocumentsId = async (id) => {
  return db.query("DELETE FROM tbl_ranches_documents WHERE id = ? ", [id]);
};
export const hardDeleteRanchesImagesId = async (id) => {
  return db.query("DELETE FROM ranch_images WHERE id = ? ", [id]);
};

// ----------------------------------------------fetch purchases ranches ---------------------------------------------//
export const modelFetchPurchasesRanches = async () => {
  return db.query(`
    SELECT
      tbl_ranch_purchases.*,tbl_ranch_purchases.id AS ranch_purchase_id,
      ranches.*,
      tbl_ranch_purchases.created_at AS purchased_date,
      ROUND((tbl_ranch_purchases.shares_purchased / ranches.total_shares) * 100, 2) AS ownership_percentage
    FROM tbl_ranch_purchases
    JOIN ranches ON tbl_ranch_purchases.ranch_id = ranches.id
  `);
}

export const fetchPurchasesRanchesModel = async () => {
  return db.query(
    `SELECT
    COUNT(DISTINCT investor_id) as total_investors,
    SUM(total_amount) as total_revenue
FROM tbl_ranch_purchases`
  );
};

export const fetchInvesterByThereIds = async (id) => {
  return db.query('SELECT * FROM investor_application Where id =?', [id])
}

export const fetchRanchImagesByRanchId = async (ranch_id) => {
  return db.query('SELECT * FROM ranch_images Where ranch_id =? AND isDeleted = 0', [ranch_id])
}

export const fetchRanchDocumentsByRanchId = async (ranch_id) => {
  return db.query('SELECT * FROM tbl_ranches_documents Where ranch_id =? ', [ranch_id])
}

// ---------------------------------------ranches approved and reject model-------------------------------------//

export const approvedInvesterRanches = async (id) => {
  return db.query(`
      UPDATE tbl_ranch_purchases
      SET reservation_status = 'APPROVED'
      WHERE id = ?
    `, [id]
  );
};

export const fetchInvesterAndUsersDetailByPurchaseRanchesId = async (purchaseId) => {
  return db.query(`
    SELECT i.*, p.*,u.fullName,u.email AS userEmail,r.*,SUM(p.shares_purchased) AS shares_purchased,r.id AS ranch_id,
    u.id AS user_id,i.fcmToken AS investor_fcmToken,u.fcmToken AS user_fcmToken,i.id AS investor_id
    FROM tbl_ranch_purchases p
    JOIN investor_application i ON p.investor_id = i.id
    JOIN ranches r ON p.ranch_id = r.id
    JOIN tbl_users u ON i.user_id = u.id
    WHERE p.id = ?
  `, [purchaseId]);
};

export const fetchTotalSharesSold = async (ranch_id) => {
  return db.query('SELECT SUM(shares_purchased) AS total_shares_purchased FROM tbl_ranch_purchases WHERE ranch_id = ?', [ranch_id])
}

export const fetchInvester_supports = async () => {
  try {
    const query = `
      SELECT 
        u.fullname,
        i.*
      FROM invester_contact_supports AS i
      INNER JOIN tbl_users AS u 
        ON i.user_id = u.id
      ORDER BY i.createdAt DESC
    `;

    return await db.query(query);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch investor supports.");
  }
};


export const invester_support_by_id = async (support_id) => {
  try {
    const query = `
            SELECT *
            FROM invester_contact_supports
           WHERE id = ?; 
        `;
    return await db.query(query, [support_id]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch supports.");
  }
};


export const finallyApprovedInvesterRanches = async (id) => {
  return db.query(`
      UPDATE tbl_ranch_purchases
      SET reservation_status = 'APPROVED',payment_status='COMPLETED'
      WHERE id = ?
    `, [id]
  );
};

export const finallyRejectInvesterRanches = async (id) => {
  return db.query(`
      UPDATE tbl_ranch_purchases
      SET reservation_status = 'REJECTED',payment_status='REJECTED',refunded=1
      WHERE id = ?
    `, [id]
  );
};

// --------------------------------------insert blackout days--------------------------------------//

export const insertRanchBlackoutDays = async (data) => {
  return db.query("INSERT INTO ranches_blackout_days  SET?", [data]);
};

export const fetchRanchBlackoutDays = async (ranch_id) => {
  return db.query("SELECT * FROM ranches_blackout_days  WHERE ranch_id = ?", [ranch_id]);
};

export const deleteRanchBlackoutDays = async (id) => {
  return db.query("DELETE FROM ranches_blackout_days  WHERE id = ?", [id]);
};

export const bookingRequestModel = async () => {
  return db.query(`SELECT bookings.*,tbl_users.fullName,ranches.name AS ranch_name FROM bookings  
    JOIN investor_application ON investor_application.id=bookings.investor_id
    JOIN ranches ON ranches.id=bookings.ranch_id
    JOIN tbl_users ON tbl_users.id=investor_application.user_id
    ORDER BY bookings.created_at DESC`);
};

export const fetchBookingRanchesByIdsModel = async (id) => {
  return db.query(`SELECT tbl_users.fcmToken AS userFcmToken,investor_application.fcmToken AS investerFcmToken,ranches.name,ranches.id AS ranches_id,
    tbl_users.id AS userId,investor_application.id AS investerId
    FROM 
    bookings 
    JOIN investor_application ON investor_application.id=bookings.investor_id
    JOIN ranches ON ranches.id=bookings.ranch_id
    JOIN tbl_users ON tbl_users.id=investor_application.user_id
    WHERE bookings.id = ?`, [id]);
}

export const bookingApprovedAndRejectById = async (id, status) => {
  return db.query(`UPDATE bookings SET status = ? WHERE id = ?`, [status, id]);
};

export const bookingRequestModelbyIds = async (bookingId) => {
  return db.query(`
    SELECT bookings.*,tbl_users.fullName,ranches.name AS ranch_name 
    FROM bookings  
    JOIN investor_application ON investor_application.id=bookings.investor_id
    JOIN ranches ON ranches.id=bookings.ranch_id
    JOIN tbl_users ON tbl_users.id=investor_application.user_id
    WHERE bookings.id = ?`, [bookingId]);
};

export const fetchRanchesbookedDatesByIds = async (booking_id) => {
  return db.query("SELECT booked_dates FROM tbl_booked_dates  WHERE booking_id = ?", [booking_id]);
};

export const updateNotActiveAdminChats = async (chatId) => {
  return db.query(`UPDATE tbl_investor_chat  SET isAdminActive = 0 WHERE id = ?`, [chatId]);
};

export const fetchAdminDetails = async (admin_id) => {
  try {
    return await db.query(`SELECT * FROM tbl_admin `);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch user data.");
  }
};

export const investor_support_reply_model = async (data) => {
  return db.query("INSERT INTO investor_support_reply SET ?", [data]);
};

export const fetchInvestorSupportReply = async (id) => {
  try {
    return await db.query(`SELECT * FROM investor_support_reply WHERE investorContactSupportId =? `, [id]);
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to fetch user data.");
  }
};

export const fetchOrderItemByID = async (orderId) => {
  return db.query(`
    SELECT 
      oi.*,
      p.product_name,
      p.seller_id,
      c.color_name,
      s.size_value,
      s.size_system,
      s.fit_type,
      v.color_id,
      p.shipping_charges AS shippingCharge,
      (SELECT SUM(quantity * price_at_order)
       FROM tbl_order_items
       WHERE order_id = ?) AS totalAmount
    FROM tbl_order_items oi
    JOIN tbl_products p ON oi.product_id = p.pId
    JOIN tbl_product_variants v ON oi.variant_id = v.id
    JOIN tbl_product_colors c ON v.color_id = c.id
    JOIN tbl_size_master s ON v.size_id = s.id
    WHERE oi.order_id = ?
  `, [orderId, orderId]);
};

export const getSellerLastPayoutDataModel = async (sellerId) => {
  return db.query(`
    SELECT 
      IFNULL(SUM(gross_amount), 0) AS total_amount
    FROM tbl_seller_payout
    WHERE seller_id = ?
      AND payout_status = 'completed'
  `, [sellerId]);
};

export const getAllSellerPayoutListAdminModel = async () => {
  return db.query(`
    SELECT 
      seller_id,
      payout_amount,
      admin_commission,
      gross_amount,
      payout_status,
      stripe_transfer_id,
      createdAt
    FROM tbl_seller_payout
    ORDER BY createdAt DESC
  `);
};

export const getAdminAllWallet = async () => {
  return db.query(`
    SELECT oi.price_at_order, oi.quantity, oi.delivery_charge
    FROM tbl_order_items oi
  `);
};

export const fetchOrderItemByIDForSeller = async (orderId, sellerId) => {
  return db.query(`
    SELECT 
      oi.id,
      oi.order_id,
      oi.product_id,
      oi.variant_id,
      oi.quantity,
      oi.price_at_order,
      oi.delivery_status,
      oi.delivery_charge,

      p.product_name,
      p.seller_id,

      c.color_name,
      s.size_value,
      s.size_system,
      s.fit_type,

      v.color_id
    FROM tbl_order_items oi
    JOIN tbl_products p ON oi.product_id = p.pId
    JOIN tbl_product_variants v ON oi.variant_id = v.id
    JOIN tbl_product_colors c ON v.color_id = c.id
    JOIN tbl_size_master s ON v.size_id = s.id
    WHERE 
      oi.order_id = ?
      AND p.seller_id = ?
  `, [orderId, sellerId]);
};


export const get_all_product_data_by_variant = async () => {
  return db.query(`
    SELECT
      p.pId,
      p.seller_id,
      p.product_name,
      p.product_category,
      p.product_description,
      p.base_price,
      p.discount,
      p.final_price,
      p.shipping_charges,
      p.free_shipping,
      p.status,
      p.is_active,
      p.is_boost,
      p.viewed,
      p.created_at,
      p.updated_at,

      s.businessName,
      s.bussinessDescription,

      c.id          AS color_id,
      c.color_name,

      pv.id         AS variant_id,
      pv.stock_quantity,
      pv.low_stock_alert,
      sm.size_system,
      sm.size_value,
      sm.fit_type,
      pv.size_id,

      pi.pImg_id    AS pImg_id,
      pi.pImage,
      pi.created_at AS image_created_at

    FROM tbl_products p
    JOIN tbl_sellers s ON s.id = p.seller_id

    LEFT JOIN tbl_product_colors c
      ON c.pid = p.pId

    LEFT JOIN tbl_product_variants pv
      ON pv.pid = p.pId
      AND pv.color_id = c.id

    LEFT JOIN tbl_size_master sm
      ON sm.id = pv.size_id

    LEFT JOIN tbl_productimg pi
      ON pi.pImg_id = p.pId
      AND pi.color_id = c.id

    ORDER BY p.created_at DESC
  `);
};
