import db from "../config/db.js";

export const getInvestorByEmail = async (email) => {
  return db.query('SELECT i.*,u.email as user_email,u.password FROM investor_application i JOIN tbl_users u ON u.id = i.user_id WHERE u.email = ?', [email]);
}

export const getInvestorById = async (id) => {
  return db.query(
    `SELECT 
        i.*,
        u.email as user_email,
        u.userName,
        u.fullName as user_fullName,
        u.bio as user_bio,
        u.huntingTitle as user_huntingTitle,
        u.location as user_location,
        u.profileImage as user_profileImage,
        u.backgroundImage as user_backgroundImage,
        u.isVerified as user_isVerified,
        u.socialProvider as user_socialProvider,
        u.code as user_code,
        u.socialId as user_socialId,
        u.status as user_status,
        u.address as user_address,
        u.is_suspended as user_is_suspended,
        u.is_online as user_is_online,
        u.createdAt as user_createdAt,
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
     FROM investor_application i
     JOIN tbl_users u ON u.id = i.user_id
     LEFT JOIN investor_documents idoc ON idoc.investor_id = i.id
     WHERE i.id = ?
     GROUP BY i.id
     ORDER BY i.created_at DESC`,
    [id]
  );
};

export const getAllRanches = async () => {
  return db.query(`
    SELECT 
      r.*, 
      COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', i.id,
            'url', i.url,
            'is_cover', i.is_cover
          )
        ),
        JSON_ARRAY()
      ) AS images
    FROM ranches r
    LEFT JOIN ranch_images i ON i.ranch_id = r.id
    WHERE r.status = "PUBLISHED"
    GROUP BY r.id
    ORDER BY r.created_at DESC
  `);
};

// export const getRanchesById = async (id) => {
//   return db.query(`
//     SELECT 
//       r.*, 
//       CONCAT(
//         '[',
//         GROUP_CONCAT(
//           CONCAT(
//             '{"id":', i.id,
//             ',"url":"', i.url,
//             '","is_cover":"', i.is_cover, '"}'
//           )
//           SEPARATOR ','
//         ),
//         ']'
//       ) AS images 
//     FROM ranches r  
//     LEFT JOIN ranch_images i ON i.ranch_id = r.id 
//     WHERE r.status = "PUBLISHED" 
//     AND r.id = ?
//     GROUP BY r.id
//     ORDER BY r.created_at DESC
//   `, [id]);
// };

export const getRanchesById = async (id) => {
  return db.query(`
    SELECT 
      r.*, 
      COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', i.id,
            'url', JSON_UNQUOTE(JSON_QUOTE(COALESCE(i.url, ''))),
            'is_cover', i.is_cover
          )
        ),
        JSON_ARRAY()
      ) AS images
    FROM ranches r
    LEFT JOIN ranch_images i ON i.ranch_id = r.id
    WHERE r.status = "PUBLISHED"
      AND r.id = ?
    GROUP BY r.id
    ORDER BY r.created_at DESC
  `, [id]);
};

export const fetchInvestorStats = async (investorId) => {
  const query = `
    SELECT 
      COUNT(DISTINCT ranch_id) AS total_ranches,
      SUM(total_amount) AS investment_value,
      SUM(shares_purchased) AS active_shares
    FROM tbl_ranch_purchases
    WHERE investor_id = ?
      AND reservation_status = 'APPROVED';
  `;

  const rows = await db.query(query, [investorId]);
  return rows;
};


export const getInvestedRanchesByInvesterId = async (id) => {
  return db.query('SELECT * FROM tbl_ranch_purchases where investor_id=? AND reservation_status= ?', [id, 'APPROVED'])
}

export const getInvesterByUserIdModel = async (id) => {
  console.log('id', id);

  return db.query('SELECT * FROM investor_application Where user_id =?', [id])
}

export const updateRanchPurchaseStatus = async (id, payment_intent_id) => {
  console.log('id, payment_intent_id', id, payment_intent_id);

  return db.query(
    `UPDATE tbl_ranch_purchases 
     SET payment_status = 'DEPOSIT_PAID', payment_intent_id = ?
     WHERE id = ?`,
    [payment_intent_id, id]
  );
};


// ---------------------------------escrow model----------------------------------//

export const findPurchaseByEscrowId = async (escrowRefferenceId) => {
  const purchase = await db.query(` SELECT rp.*, u.fullName, u.email, r.name 
    FROM tbl_ranch_purchases rp
    JOIN investor_application i ON rp.investor_id = i.id
    JOIN ranches r ON rp.ranch_id = r.id
    JOIN tbl_users u ON i.user_id = u.id
    WHERE rp.escrow_reference_id = ?
  `, [escrowRefferenceId]);
  return purchase[0];
}

export const fetchInvestedRanchesByRanchesIdPending = async (ranch_id, investor_id) => {
  return db.query(`
    SELECT 
      r.id AS ranch_id,
      r.total_shares,
      rp.payment_status,
      rp.escrow_reference_id,
      SUM(rp.shares_purchased) AS shares_purchased,
      -- This investor's shares and investment
      SUM(CASE WHEN rp.investor_id = ? THEN rp.shares_purchased ELSE 0 END) AS investor_shares_purchased,
      SUM(CASE WHEN rp.investor_id = ? THEN rp.total_amount ELSE 0 END) AS investor_total_investment,
      
      -- Other investors' shares
      SUM(CASE WHEN rp.investor_id != ? THEN rp.shares_purchased ELSE 0 END) AS other_investors_shares,
      
      -- Ownership % for this investor
      ROUND((SUM(CASE WHEN rp.investor_id = ? THEN rp.shares_purchased ELSE 0 END) / r.total_shares) * 100, 2) AS ownership_percentage,
      
      -- Available shares
      ROUND(
        r.total_shares - SUM(rp.shares_purchased),
        2
      ) AS available_shares
      
    FROM tbl_ranch_purchases rp
    JOIN ranches r ON r.id = rp.ranch_id
    WHERE rp.ranch_id = ? AND rp.reservation_status='PENDING'
    GROUP BY r.id
  `, [investor_id, investor_id, investor_id, investor_id, ranch_id]);
};

export const fetchAllPendingRanchesModelPending = async (id) => {
  return db.query(`
  SELECT 
    rp.id,
    rp.created_at,
    rp.reservation_status,
    rp.payment_status,
    rp.ranch_id,
    r.name,
    r.location,
    r.total_shares,
    rp.shares_purchased,
    rp.total_amount,
    rp.escrow_reference_id,
    rp.price_per_share
  FROM tbl_ranch_purchases rp
  JOIN ranches r ON r.id = rp.ranch_id
  WHERE rp.id = ?
`, [id]);
};

export const addFcmTokenWhenLogin = async (fcmToken, id) => {
  return db.query(`UPDATE investor_application SET fcmToken = ? WHERE id = ?`, [fcmToken, id]);
};

export const fetchAllInvestorNotificationModel = async (id) => {
  return db.query('SELECT * FROM tbl_notification WHERE investorId=?', [id]);
}


// ---------------------------------------investor chat model--------------------------------------------------//

export const createInvestorChatRoom = async (ranchId, investorId) => {
  const rows = await db.query("SELECT id FROM tbl_investor_chat WHERE ranch_id = ? AND investor_id = ? LIMIT 1", [ranchId, investorId]);
  if (rows.length > 0) return rows[0].id;
  const result = await db.query("INSERT INTO tbl_investor_chat (ranch_id, investor_id) VALUES (?, ?)", [ranchId, investorId]);
  return result.insertId;
};

export const fetchInvestorChatMessages = async (chatRoomId) => {
  const rows = await db.query("SELECT sender_type, message, created_at FROM tbl_investor_chat_messages WHERE room_id = ? ORDER BY created_at ASC", [chatRoomId]);
  return rows;
};

export const saveInvestorMessage = async (ranchId, investorId, senderType, message) => {
  try {
    const rows = await db.query("SELECT id FROM tbl_investor_chat WHERE ranch_id = ? AND investor_id = ? LIMIT 1", [ranchId, investorId]);
    if (!rows || rows.length === 0) throw new Error("Chat room not found");
    const chatRoomId = rows[0].id;
    const result = await db.query("INSERT INTO tbl_investor_chat_messages (room_id, sender_type, sender_id, message) VALUES (?, ?, ?, ?)",
      [chatRoomId, senderType, investorId, message]);

    await db.query("UPDATE tbl_investor_chat SET updated_at = NOW() WHERE id = ?", [chatRoomId]);
    return { chatRoomId, created_at: new Date() };
  } catch (err) {
    console.error("💥 Error in saveInvestorMessage:", err.message);
    throw err;
  }
};

export const fetchInvestorChatList = async (userType, userId) => {
  if (userType === "ADMIN") {
    return await db.query(`
      SELECT ic.*, r.name AS ranch_name, u.fullName AS investor_name,u.profileImage,
             (SELECT message FROM tbl_investor_chat_messages m WHERE m.room_id = ic.id ORDER BY m.created_at DESC LIMIT 1) AS last_message,
             (SELECT COUNT(*) FROM tbl_investor_chat_messages m WHERE m.room_id = ic.id AND m.is_read = 0 AND m.sender_type != 'ADMIN') AS unread_count
      FROM tbl_investor_chat ic
      JOIN ranches r ON ic.ranch_id = r.id
      JOIN investor_application i ON ic.investor_id = i.id
      JOIN tbl_users u ON i.user_id = u.id
      ORDER BY ic.updated_at DESC
    `);
  } else {
    return await db.query(`
      SELECT ic.*, r.name,
             (SELECT message FROM tbl_investor_chat_messages m WHERE m.room_id = ic.id ORDER BY m.created_at DESC LIMIT 1) AS last_message,
             (SELECT COUNT(*) FROM tbl_investor_chat_messages m WHERE m.room_id = ic.id AND m.is_read = 0 AND m.sender_type != 'INVESTOR') AS unread_count
      FROM tbl_investor_chat ic
      JOIN ranches r ON ic.ranch_id = r.id
      WHERE ic.investor_id = ?
      ORDER BY ic.updated_at DESC
    `, [userId]);
  }
};

export const fetchAdminGroupedChatList = async () => {
  const rows = await db.query(`
    SELECT 
      u.id AS investor_user_id,
      u.fullName AS investor_name,
      u.profileImage AS investor_image,
      i.id AS investor_id,
      ic.id AS chat_id,
      ic.ranch_id,
      r.name AS ranch_name,
      (
        SELECT m.message 
        FROM tbl_investor_chat_messages m 
        WHERE m.room_id = ic.id 
        ORDER BY m.created_at DESC 
        LIMIT 1
      ) AS last_message,
      (
        SELECT COUNT(*) 
        FROM tbl_investor_chat_messages m 
        WHERE m.room_id = ic.id 
          AND m.is_read = 0 
          AND m.sender_type != 'ADMIN'
      ) AS unread_count,
      ic.updated_at
    FROM tbl_investor_chat ic
    JOIN investor_application i ON ic.investor_id = i.id
    JOIN tbl_users u ON i.user_id = u.id
    JOIN ranches r ON ic.ranch_id = r.id
    ORDER BY i.id, ic.updated_at DESC
  `);

  // 🧩 Group the results manually in Node.js
  const grouped = {};
  for (const row of rows) {
    if (!grouped[row.investor_id]) {
      grouped[row.investor_id] = {
        investor_user_id: row.investor_user_id,
        investor_name: row.investor_name,
        investor_image: row.investor_image,
        investor_id: row.investor_id,
        ranches: [],
        total_unread: 0
      };
    }

    grouped[row.investor_id].ranches.push({
      chat_id: row.chat_id,
      ranch_id: row.ranch_id,
      ranch_name: row.ranch_name,
      last_message: row.last_message,
      unread_count: row.unread_count
    });

    grouped[row.investor_id].total_unread += Number(row.unread_count);
  }

  // Return as array sorted by recent update
  return Object.values(grouped).sort((a, b) => b.total_unread - a.total_unread);
};

export const fetchInvestorListForAdmin = async () => {
  const rows = await db.query(`
    SELECT 
      u.id AS investor_user_id,
      u.fullName AS investor_name,
      u.profileImage,
      i.id AS investor_id,

      -- Latest ranch name
      (
        SELECT r.name
        FROM tbl_investor_chat ic
        JOIN ranches r ON ic.ranch_id = r.id
        JOIN tbl_investor_chat_messages m ON m.room_id = ic.id
        WHERE ic.investor_id = i.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) AS latest_ranch_name,

      -- Total unread messages
      (
        SELECT COUNT(*) FROM tbl_investor_chat_messages m JOIN tbl_investor_chat c ON m.room_id = c.id
        WHERE c.investor_id = i.id AND m.is_read = 0 AND m.sender_type = 'INVESTOR'
      ) AS total_unread,

      -- Latest message timestamp
      (
        SELECT MAX(m.created_at)
        FROM tbl_investor_chat_messages m
        JOIN tbl_investor_chat c ON m.room_id = c.id
        WHERE c.investor_id = i.id
      ) AS last_message_time

    FROM investor_application i
    JOIN tbl_users u ON i.user_id = u.id

    WHERE EXISTS (
      SELECT 1 FROM tbl_investor_chat ic WHERE ic.investor_id = i.id
    )

    ORDER BY last_message_time DESC;
  `);

  return rows;
};


export const fetchInvestorRanchesByInvestorIdListForAdmin = async (investorId) => {
  const rows = await db.query(`
    SELECT 
      ic.id AS chat_id,
      ic.ranch_id,
      r.name AS ranch_name,
      (
        SELECT message 
        FROM tbl_investor_chat_messages m 
        WHERE m.room_id = ic.id 
        ORDER BY m.created_at DESC 
        LIMIT 1
      ) AS last_message,
      (
        SELECT COUNT(*) 
        FROM tbl_investor_chat_messages m 
        WHERE m.room_id = ic.id 
          AND m.is_read = 0 
          AND m.sender_type = 'INVESTOR'
      ) AS unread_count,
      (
        SELECT MAX(m.created_at)
        FROM tbl_investor_chat_messages m
        WHERE m.room_id = ic.id
      ) AS last_message_time
    FROM tbl_investor_chat ic
    JOIN ranches r ON ic.ranch_id = r.id
    WHERE ic.investor_id = ?
    ORDER BY last_message_time DESC
  `, [investorId]);
  return rows;
};

export const updateActiveInvestorChats = async (chatId) => {
  return db.query(`UPDATE tbl_investor_chat  SET isIvestorActive = 1 WHERE id = ?`, [chatId]);
};

export const updateActiveAdminChats = async (chatId) => {
  return db.query(`UPDATE tbl_investor_chat  SET isAdminActive = 1 WHERE id = ?`, [chatId]);
};

export const fetchInvestorChatByChatIds = async (chatRoomId) => {
  const rows = await db.query("SELECT * FROM tbl_investor_chat WHERE id = ? ", [chatRoomId]);
  return rows;
};


export const getInvestorByThereId = async (id) => {
  return db.query('SELECT i.*,u.fullName as user_fullName,u.email as user_email,u.fcmToken FROM investor_application i JOIN tbl_users u ON u.id = i.user_id WHERE i.id = ?', [id]);
}

export const updateIsReadAdminChats = async (chatId) => {
  return db.query(`UPDATE tbl_investor_chat_messages  SET is_read = 1 WHERE room_id = ? AND sender_type = ?`, [chatId, 'INVESTOR']);
};

export const updateIsReadInvetorChats = async (chatId) => {
  return db.query(`UPDATE tbl_investor_chat_messages  SET is_read = 1 WHERE room_id = ? AND sender_type = ?`, [chatId, 'ADMIN']);
};

export const modifyNotActiveAdminChats = async () => {
  return db.query(`UPDATE tbl_investor_chat  SET isAdminActive = 0 WHERE isAdminActive = ?`, [1]);
};

export const updateNotActiveInvestChats = async (chatId) => {
  return db.query(`UPDATE tbl_investor_chat  SET isIvestorActive = 0 WHERE isIvestorActive = ?`, [1]);
};

export const fetchRanchesImagesByRanchesId = async (ranch_id) => {
  const rows = await db.query("SELECT url FROM ranch_images WHERE ranch_id = ? ", [ranch_id]);
  return rows;
};
