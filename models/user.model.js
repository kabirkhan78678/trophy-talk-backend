import db from "../config/db.js";

/**=======================user model start =====================================*/
export const isUsersExistsOrNot = async (email) => {
    return db.query("SELECT * FROM tbl_users WHERE email = ?", [email]);
};


export const isUsersExistsOrNotAndVerifiedOrNot = async (email) => {
    return db.query("SELECT * FROM tbl_users WHERE email = ? AND isVerified = 1 ", [email]);
};

export const isUsersExistsOrNotAndVerifiedNot = async (email) => {
    return db.query("SELECT * FROM tbl_users WHERE email = ? AND isVerified = 0 ", [email]);
};

export const deleteUnVarifiedUsers = async (id, userId) => {
    return db.query(` DELETE FROM tbl_users WHERE id = ? `, [id]);
};

export const fetchUsersByActivationCode = async (activationCode) => {
    return db.query("SELECT * FROM tbl_users WHERE code = ?", [activationCode]);
};


export const updateUsersByOtp = async (id) => {
    return db.query(
        `Update tbl_users set isVerified = 1 where id = ?`,
        [id]
    );
};

export const userRegistration = async (data) => {
    return db.query("INSERT INTO tbl_users SET ?", [data]);
};

export const fetchForgotPasswordCodeByCode = async (activationCode) => {
    return db.query("SELECT * FROM tbl_users WHERE forgotPasswordOtp = ?", [activationCode]);
};

export const updateUserForgotPasswordOtp = async (code, email) => {
    const query = "UPDATE tbl_users SET forgotPasswordOtp = ? WHERE email = ?";
    return db.query(query, [code, email]);
};

export const updateUserOtp = async (code, email) => {
    const query = "UPDATE tbl_users SET code = ? WHERE email = ?";
    return db.query(query, [code, email]);
};

export const fetchUsersByToken = async (genToken) => {
    return db.query("SELECT * FROM tbl_users WHERE genToken = ?", [genToken]);
};

export const updateUserPassword = async (password, email) => {
    const query = "UPDATE tbl_users SET password = ? WHERE email = ?";
    return db.query(query, [password, email]);
};

export const fetchUsersById = async (id) => {
    return db.query("SELECT * FROM tbl_users WHERE id = ?", [id]);
};

export const changePassword = async (password, id) => {
    const query = "UPDATE tbl_users SET password = ? WHERE id = ?";
    return db.query(query, [password, id]);
};

export const updateUsersProfile = async (updatedFields, id) => {
    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    values.push(id);
    const query = `UPDATE tbl_users SET ${setClause} WHERE id = ?`;
    return db.query(query, values);
};

export const create_blocked = async (data) => {
    return db.query("INSERT INTO tbl_blockedusers SET ?", [data]);
};

export const unblockedToUsers = async (id, userId) => {
    return db.query(` DELETE FROM tbl_blockedusers WHERE blocked_from=? AND blocked_to=?`, [id, userId]);
};

export const fetchBlockedListUsers = async (id) => {
    return db.query(`SELECT * FROM tbl_blockedusers WHERE blocked_from = ? ORDER BY createdAt DESC`, [id]);
};

export const fetchBlockedUsersDetailed = async (blockedToIds) => {
    return db.query(`SELECT * FROM tbl_users WHERE id IN (${blockedToIds.join(',')})`)
};

export const insertUserNotifications = async (message, status, postId) => {
    let investorId = message.data.investorId ? message.data.investorId : 0
    try {
        let isSendTo = (message.data.notificationType === 4 || message.data.notificationType === 6) ? 1 : 0;
        const result = await db.query(
            `INSERT INTO tbl_notification (sendFrom, sendTo, followId, title, body, profileImage,notificationType, status, postId,isSendTo,investorId) 
             VALUES (?, ?, ?, ?, ?, ?, ?,?,?, ?,?)`,
            [
                message.data.sendFrom,
                message.data.sendTo,
                message.data.followId || null,
                message.notification.title,
                message.notification.body,
                message.notification.profileImage,
                message.data.notificationType,
                status,
                postId,
                isSendTo,
                investorId
            ]
        );
        return result;
    } catch (error) {
        console.error("Database Insert Error:", error);
        return null;
    }
};

export const insertFollowersUsers = async (data) => {
    return db.query("INSERT INTO tbl_usersfollowers SET ?", [data]);
};

export const retrieveMyFollowing = async (id) => {
    return db.query("SELECT followingId FROM tbl_usersfollowers WHERE followersId = ? AND status=1 ", [id]);
};

export const retrieveMyFollowers = async (id) => {
    return db.query("SELECT followersId FROM tbl_usersfollowers WHERE followingId = ? AND status=1 ", [id]);
};

export const confirmRequest = async (followId) => {
    return db.query("UPDATE tbl_usersfollowers SET status = 1 WHERE id = ?", [followId]);
};

export const rejectRequest = async (followId) => {
    return db.query(` DELETE FROM tbl_usersfollowers WHERE id=?`, [followId]);
};

export const unFollow = async (id, userId) => {
    return db.query(` DELETE FROM tbl_usersfollowers WHERE followersId=? And followingId=?`, [id, userId]);
};

export const fetchThereOwnPostModel = async (id) => {
    return db.query("SELECT * FROM tbl_mypost WHERE userId = ? ORDER BY createdAt DESC", [id]);
};

export const fetchOtherPostModel = async (limit, offset) => {
    return db.query("SELECT * FROM tbl_mypost ORDER BY createdAt DESC LIMIT ? OFFSET ?", [limit, offset]);
};

export const addUserLikeToPost = async (data) => {
    return db.query("INSERT INTO tbl_userslike SET ?", [data]);
};

export const fetchUsersLikeToPostDataByUsersId = async (id, postId) => {
    return db.query("SELECT * FROM tbl_userslike WHERE userId  = ? And postId =?", [id, postId]);
};

export const UsersUnLikeToPost = async (id) => {
    return db.query(` DELETE FROM tbl_userslike WHERE id=?`, [id]);
};

export const fetchLikeOnParticularPost = async (id) => {
    return db.query("SELECT * FROM tbl_userslike WHERE postId = ?", [id]);
};

export const userViewOtherPost = async (data) => {
    return db.query("INSERT INTO tbl_userviewspost SET ?", [data]);
};

export const fetchTotalViewsOnPost = async (id) => {
    return db.query("SELECT * FROM tbl_userviewspost WHERE postId = ?", [id]);
};

export const isAllreadyUserViewThePost = async (id, postId) => {
    return db.query("SELECT * FROM tbl_userviewspost WHERE userId=? AND postId = ?", [id, postId]);
};

export const isUsersFollowToAnotherUsers = async (id, userId) => {
    return db.query("SELECT * FROM tbl_usersfollowers WHERE followersId=? And followingId=? ", [id, userId]);
};

export const createNewPosts = async (data) => {
    return db.query("INSERT INTO tbl_mypost SET ?", [data]);
};

export const fetchUsersNotificationByUsersId = async (id) => {
    return db.query("SELECT * FROM tbl_notification WHERE sendTo = ? AND isSendTo = 0  ORDER BY createdAt DESC", [id]);
};

export const fetchAllUsersModel = async (id) => {
    return db.query("SELECT * FROM tbl_users WHERE id != ?", [id]);
};

export const fetchBlockedByUsersIdAndCurrentUserLogin = async (id, userId) => {
    return db.query(`SELECT * FROM tbl_blockedusers WHERE blocked_from = ? And blocked_to = ? `, [id, userId]);
};

export const accountDeleteModel = async (id) => {
    return db.query(` DELETE FROM tbl_users WHERE id=?`, [id]);
};

export const addCommentsOnParticularPost = async (data) => {
    return db.query("INSERT INTO tbl_userscomment SET ?", [data]);
};

export const fetchCommentAccordingToPostId = async (id) => {
    return db.query("SELECT * FROM tbl_userscomment WHERE postId = ? ORDER BY createdAt DESC", [id]);
};

export const fetchCommentAccordingToParentCommentId = async (id) => {
    return db.query("SELECT * FROM tbl_userscomment WHERE parentCommentId = ? ORDER BY createdAt DESC", [id]);
};

export const addLikesOnParticularCommentPost = async (data) => {
    return db.query("INSERT INTO tbl_commentlikes SET ?", [data]);
};

export const fetchLikeOnPostCommentedByUsersId = async (id, postId) => {
    return db.query("SELECT * FROM tbl_commentlikes WHERE commentId  = ? And userId =?", [id, postId]);
};

export const UsersUnLikeToCommentedPost = async (id) => {
    return db.query(` DELETE FROM tbl_commentlikes WHERE id=?`, [id]);
};

export const pushNotificationOn = async (id) => {
    const query = "UPDATE tbl_users SET pushNotifications = 1 WHERE id = ?";
    return db.query(query, [id]);
};

export const pushNotificationOff = async (id) => {
    const query = "UPDATE tbl_users SET  pushNotifications = 0 WHERE id = ?";
    return db.query(query, [id]);
};

export const giveAwayAnnoucmentOn = async (id) => {
    const query = "UPDATE tbl_users SET giveAwayAnnoucment = 1 WHERE id = ?";
    return db.query(query, [id]);
};

export const giveAwayAnnoucmentOff = async (id) => {
    const query = "UPDATE tbl_users SET  giveAwayAnnoucment = 0 WHERE id = ?";
    return db.query(query, [id]);
};

export const deletePostByCommentsId = async (id) => {
    return db.query(` DELETE FROM tbl_userscomment WHERE id=?`, [id]);
};

export const fetchUsersByPostId = async (id) => {
    return db.query("SELECT * FROM tbl_mypost WHERE id = ? ORDER BY createdAt DESC", [id]);
};

export const deleteAllNotificationOfGivenUsers = async (id) => {
    return db.query(` DELETE FROM tbl_notification WHERE sendTo=?`, [id]);
};

export const deleteNotificationByIds = async (id) => {
    return db.query(` DELETE FROM tbl_notification WHERE id=?`, [id]);
};

export const deletePostByIds = async (id) => {
    return db.query(` DELETE FROM tbl_mypost WHERE id=?`, [id]);
};

export const updateUsersPostsById = async (updatedFields, id) => {
    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    values.push(id);
    const query = `UPDATE tbl_mypost SET ${setClause} WHERE id = ?`;
    return db.query(query, values);
};

export const insertUsersSupports = async (data) => {
    return db.query("INSERT INTO tbl_usersupport SET ?", [data]);
};

// Cart // # Abhay

export const addProductToCartModal = async (Data) => {
    return db.query(`Insert into tbl_users_cart set ?`, [Data]);
};

export const checkAvailableProductModel = async (product_id, user_id) => {
    return db.query(`Select * from tbl_users_cart WHERE tbl_users_cart.pId = ? AND tbl_users_cart.user_id = ?`, [product_id, user_id]);
};

export const getAllCartProductModel = async (ID) => {
    return db.query(`Select * from tbl_users_cart WHERE tbl_users_cart.user_id = ? ORDER BY created_at DESC`, [ID]);
};

export const updateCartDataModel = async (Data, ID, PID) => {
    return db.query(
        `UPDATE tbl_users_cart 
         SET quantity = ?   
         WHERE id = ? 
         AND (SELECT stock_quantity FROM tbl_products WHERE pId = ?) >= ?`,
        [Data.quantity, ID, PID, Data.quantity]
    );
};

export const getCartDataByCartIdModal = async (ID) => {
    return db.query(
        `select * FROM tbl_users_cart WHERE tbl_users_cart.id = ?`,
        [ID]
    );
};

export const deleteCartProductByIdModal = async (ID) => {
    return db.query(
        `DELETE FROM tbl_users_cart WHERE tbl_users_cart.id = ?`,
        [ID]
    );
};

// Favoriates // # Abhay
export const getFavorietsProductDetailsById = async (ID, UID) => {
    return db.query(`Select * from tbl_favorites WHERE pId = ? AND user_id = ?`, [ID, UID]);
};

export const addProductToFavoritesModal = async (ID) => {
    return db.query(`Insert into tbl_favorites set ? `, [ID]);
};

export const removeProductToFavoritesModel = async (ID) => {
    return db.query(`DELETE FROM tbl_favorites WHERE pId = ?`, [ID]);
};

export const getFavoritesProductListModel = async (ID) => {
    return db.query(`Select * from tbl_favorites where user_id = ?`, [ID]);
};

export const getFavoritesProductBYIDModel = async (ID) => {
    return db.query(`Select * from tbl_favorites where pId = ?`, [ID]);
};

export const checkProductDataByIdModel = async (ID) => {
    return db.query(`Select * from tbl_products where pId = ? AND status = 0`, [ID]);
};

export const fetchSupportCategory = async () => {
    return db.query("SELECT * FROM tbl_support_category");
};

// Checkout // # Abhay 

export const checkoutProductModel = async (ID) => {
    return db.query('DELETE FROM tbl_users_cart WHERE user_id = ?', [ID]);
};

export const addAddressModel = async (Data) => {
    return db.query(`Insert into tbl_shipping_address set ?`, [Data]);
};

export const getAddressModel = async (ID) => {
    return db.query(`Select * from tbl_shipping_address WHERE user_id = ?`, [ID]);
};

export const fetchSupportCategoryByCategoryIds = async (ids) => {
    return db.query("SELECT * FROM tbl_support_category WHERE id = ?", [ids]);
};

/**
 * HERE IS CHAT MODEL SECTION 
 * ONE TO ONE CHAT AND GROUP CHAT
 * DEVELOPER NAME (KARAN PATEL)
 * 
 * */

export const checkIsUserChatExistsOrNot = async (userId1, userId2) => {
    return db.query(`
        SELECT c.id FROM chat c
        JOIN chat_member cm1 ON cm1.chat_id = c.id AND cm1.user_id = ?
        JOIN chat_member cm2 ON cm2.chat_id = c.id AND cm2.user_id = ?
        WHERE c.is_group = 0
        GROUP BY c.id LIMIT 1
      `, [userId1, userId2]);
};

export const createSingleChat = async (isGroup, groupName, createdBy, groupImage) => {
    return db.query(`
        INSERT INTO chat (is_group, chat_name, created_by,groupProfile)
        VALUES (?, ?, ?,?)
      `, [isGroup, isGroup ? groupName : null, createdBy, groupImage]);
};

export const createGroupChat = async (chatId, userId) => {
    return db.query(`INSERT INTO chat_member (chat_id, user_id) VALUES (?, ?)`, [chatId, userId]);
};

export const insertUsersSocketId = async (socketId, userId) => {
    return await db.query(`
        UPDATE tbl_users 
        SET socket_id = '${socketId}' 
        WHERE id = ${userId}
    `);
};

export const saveMessage = async (chatId, senderId, message, messageType) => {
    return db.query(`
        INSERT INTO message (chat_id, sender_id, message, message_type)
        VALUES (?, ?, ?, ?)
      `, [chatId, senderId, message, messageType]);
};

export const fetchMessagesById = async (messageId) => {
    return db.query(`
        SELECT m.*, u.userName AS sender_name, u.profileImage
        FROM message m
        JOIN tbl_users u ON u.id = m.sender_id
        WHERE m.id = ?
      `, [messageId]);
};

export const fetchMessages = async (chatId) => {
    return db.query(` SELECT m.*, u.fullName AS user_name,u.fullName AS fullName,u.is_online, u.profileImage,c.groupProfile FROM message m
        JOIN tbl_users u ON u.id = m.sender_id 
         JOIN chat c ON c.id = m.chat_id 
        WHERE m.chat_id = ? ORDER BY m.id DESC `, [chatId]);
};

export const markMessageAsRead = async (messageId) => {
    await db.query(`UPDATE message SET is_read = 1 WHERE id = ? `, [messageId]);
};

export const getUserChats = async (userId) => {
    return await db.query(
        `SELECT
            c.id AS chat_id,
            c.chat_name,
            c.is_group,
            c.created_by,
            c.groupProfile,
            m.message,
            m.message_type,
            m.createdAt AS lastMessageTime,
            IFNULL(unread.count, 0) AS unread_count,
            u.id AS user_id,
            u.fullName AS user_name,
            u.profileImage
        FROM chat c
        JOIN chat_member cm ON c.id = cm.chat_id AND cm.user_id = ?
        LEFT JOIN (
            SELECT x.chat_id, x.id, x.fullName, x.profileImage FROM (
                SELECT cm.chat_id, u.id, u.fullName, u.profileImage,
                       ROW_NUMBER() OVER (PARTITION BY cm.chat_id ORDER BY u.id) AS rn
                FROM chat_member cm
                JOIN tbl_users u ON cm.user_id = u.id
                WHERE cm.user_id != ?
            ) x WHERE x.rn = 1
        ) u ON u.chat_id = c.id AND c.is_group = 0
        LEFT JOIN (
            -- Get the last message for each chat
            SELECT m1.*
            FROM message m1
            INNER JOIN (
                SELECT chat_id, MAX(createdAt) AS maxCreatedAt
                FROM message
                GROUP BY chat_id
            ) m2 ON m1.chat_id = m2.chat_id AND m1.createdAt = m2.maxCreatedAt
        ) m ON m.chat_id = c.id
        LEFT JOIN (
            -- Get unread count from unread_count table
            SELECT chat_id, user_id, count
            FROM unread_count
            WHERE user_id = ?
        ) unread ON unread.chat_id = c.id
        ORDER BY COALESCE(m.createdAt, c.createdAt) DESC`,
        [userId, userId, userId]
    );
};

export const fetchAllChatsMembers = async (chat_id, userId) => {
    return await db.query(`SELECT user_id FROM chat_member WHERE chat_id = ? AND user_id != ? `, [chat_id, userId]);
};

export const fetchChatByIds = async (chatId) => {
    return db.query(`SELECT * FROM chat WHERE id= ? `, [chatId]);
};

export const fetchChatMemberByChatsIds = async (chatId) => {
    return db.query(`SELECT * FROM chat_member WHERE chat_id= ? `, [chatId]);
};

export const fetchUserById = async (userId) => {
    return await db.query(
        `SELECT 
            u.id,
            u.email,
            u.fullName AS user_name,
            u.profileImage,
            u.fcmToken
        FROM tbl_users u WHERE u.id= ?
        `,
        [userId]
    );
};

export const fetchUsersByUsersName = async (userName) => {
    return db.query(`SELECT * FROM tbl_users WHERE userName ='${userName}'`);
};


export const fetchGroupInfoByGroupId = async (groupId) => {
    return db.query(`SELECT chat.chat_name,chat.created_by,chat.groupProfile,tbl_users.fullName,tbl_users.id,tbl_users.profileImage FROM chat
JOIN chat_member ON chat.id=chat_member.chat_id
JOIN tbl_users ON chat_member.user_id=tbl_users.id
WHERE chat.id =  ?`, [groupId]);
};

export const fetchChatIdByMessageId = async (id) => {
    return db.query(`SELECT * FROM message WHERE id =?`, [id]);
};

export const removeMembersModel = async (groupId, userId) => {
    return db.query(`DELETE FROM chat_member WHERE chat_id = ? AND user_id = ? `, [groupId, userId]);
};

export const updateGroupProfile = async (updatedFields, id) => {
    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    values.push(id);
    const query = `UPDATE chat SET ${setClause} WHERE id = ?`;
    return db.query(query, values);
};


export const readAllNotificatonByUserId = async (id) => {
    return db.query(`UPDATE tbl_notification SET  isRead = 1 WHERE sendTo = ? AND isSendTo = 0 `, [id]);
};

export const saveSystemMessage = async (chatId, senderId, message, messageType, is_read) => {
    return db.query(`
        INSERT INTO message (chat_id, sender_id, message, message_type,is_read)
        VALUES (?, ?, ?, ?,?)
      `, [chatId, senderId, message, messageType, is_read]);
};

export const fetchUNreadNotificationByUsersId = async (id) => {
    return db.query("SELECT * FROM tbl_notification WHERE sendTo = ? AND isSendTo = 0 AND isRead =0 ORDER BY createdAt DESC", [id]);
};

export const fetchOtherUserBlockedListUsers = async (otherUserId, id) => {
    return db.query(`SELECT * FROM tbl_blockedusers WHERE blocked_from = ? AND blocked_to=? ORDER BY createdAt DESC`, [otherUserId, id]);
};

export const fetchAllChatsMembersIncludeMe = async (chat_id, userId) => {
    return await db.query(`SELECT user_id FROM chat_member WHERE chat_id = ? AND user_id = ? `, [chat_id, userId]);
};

export const insertAllUserUnreadMessage = async (messageId, userId, isRead, readAt) => {
    return await db.query("INSERT INTO message_read_status (message_id, user_id, is_read, read_at) VALUES (?, ?, ?, ?)",
        [messageId, userId, isRead, readAt]
    );
}


export const createUnreadCount = async (chatId, userId, count) => {
    return db.query(`INSERT INTO unread_count (chat_id, user_id,count) VALUES (?, ?, ?)`, [chatId, userId, count]);
};

export const fetchUnreadCount = async (id, currentUserId) => {
    return db.query(`SELECT * FROM unread_count WHERE chat_id = ? AND user_id = ? `, [id, currentUserId]);
};

export const updateUnreadCount = async (count, id, currentUserId) => {
    return await db.query(`
        UPDATE unread_count 
        SET count = ?
        WHERE chat_id = ? AND user_id = ?`,
        [count, id, currentUserId]
    );
};

export const isUserActive = async (chatId, currentUserId) => {
    return db.query(`SELECT * FROM tbl_user_active WHERE chat_id = ? AND userId = ? `, [chatId, currentUserId]);
};

export const createActivateUsers = async (chatId, userId, isActive) => {
    return db.query(`INSERT INTO tbl_user_active (chat_id, userId,isActive) VALUES (?, ?, ?)`, [chatId, userId, isActive]);
};

export const toActivateUsers = async (isActive, chatId, userId) => {
    return db.query(`UPDATE tbl_user_active SET isActive = ? WHERE chat_id = ? AND userId = ? `, [isActive, chatId, userId]);
};

export const modelFetchAllSweepstacks = async () => {
    return db.query("SELECT * FROM tbl_sweepstakes ORDER BY created_at DESC");
};


export const usersPurchasePlan = async (data) => {
    return db.query(`Insert into tbl_users_sweepstacks set ? `, [data]);
};


export const createOrders = async (data) => {
    return db.query(`Insert into tbl_orders set ? `, [data]);
};

export const insertOrdersItem = async (data) => {
    return db.query(`Insert into tbl_order_items set ? `, [data]);
};

export const modelOrderSummary = async (data) => {
    return db.query(`Insert into tbl_order_summary set ? `, [data]);
};

export const addUserShippingAddress = async (data) => {
    return db.query(`Insert into tbl_users_shipping_address set ? `, [data]);
};

export const fetchOrderSummary = async (id) => {
    return db.query("SELECT * FROM tbl_order_summary Where user_id = ? And status = 1", [id]);
};

export const fetchUserShippingAddress = async (id) => {
    return db.query("SELECT * FROM tbl_users_shipping_address Where user_id = ? ", [id]);
};

export const changeStatusOfOrderSummarry = async (ID) => {
    return db.query('UPDATE tbl_order_summary SET  status = 0 WHERE user_id = ? ', [ID]);
};

export const fetchOrderSummaryByOrderId = async (id) => {
    return db.query("SELECT * FROM tbl_order_summary Where id = ? ", [id]);
};

export const fetch_user_all_sweepstakes = async (id) => {
    try {
        const rows = await db.query(`SELECT * FROM tbl_users_sweepstacks WHERE user_id = ? ORDER BY createdAt DESC`, [id]);
        return rows;
    } catch (error) {
        console.error("Database Error:", error.message);
        throw new Error("Failed to fetch sweepstakes data");
    }
};

export const editShippingAddressByIdModel = async (updatedFields, id) => {
    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    values.push(id);
    const query = `UPDATE tbl_users_shipping_address SET ${setClause} WHERE id = ?`;
    return db.query(query, values);
};

export const fetchUserShippingAddressByShippingId = async (id) => {
    return db.query("SELECT * FROM tbl_users_shipping_address Where id = ? ", [id]);
};

// export const modelFetchUserOrdersByUserId = async (id) => {
//     return db.query(`SELECT tbl_orders.*,tbl_orders.createdAt AS order_date FROM tbl_orders 
//          JOIN tbl_order_items oi ON tbl_orders.id = oi.order_id Where tbl_orders.userId=?
//         ORDER BY tbl_orders.createdAt DESC `,[id]);
// };

export const modelFetchUserOrdersByUserId = async (id) => {
    return db.query(`
        SELECT DISTINCT tbl_orders.*,os.total_prices, tbl_orders.createdAt AS order_date
        FROM tbl_orders 
        JOIN tbl_order_items oi ON tbl_orders.id = oi.order_id
        JOIN tbl_order_summary os ON os.id = tbl_orders.order_summaryId
        WHERE tbl_orders.userId = ?
        ORDER BY tbl_orders.createdAt DESC
    `, [id]);
};


export const fetchOrdersItem = async (id) => {
    return db.query("SELECT * FROM tbl_order_items Where order_id = ? ", [id]);
};

export const changeStatusOfOrderSummarryByOrderId = async (ID) => {
    return db.query('UPDATE tbl_order_summary SET  status = 0 WHERE id = ? ', [ID]);
};

export const checkAndReduceStock = async (items) => {
    try {
        await db.beginTransaction();

        const unavailable = [];

        for (const item of items) {
            // SELECT ... FOR UPDATE
            const rows = await db.query(
                "SELECT stock FROM products WHERE product_id = ? FOR UPDATE",
                [item.product_id]
            );

            const stock = rows[0]?.stock ?? 0;

            if (stock < item.quantity) {
                unavailable.push({
                    product_id: item.product_id,
                    available: stock,
                    required: item.quantity,
                });
            } else {
                await db.query(
                    "UPDATE products SET stock = stock - ? WHERE product_id = ?",
                    [item.quantity, item.product_id]
                );
            }
        }

        if (unavailable.length > 0) {
            await db.rollback();
            return { success: false, unavailable };
        } else {
            await db.commit();
            return { success: true };
        }
    } catch (err) {
        await db.rollback();
        throw err;
    }
};

// ---------------------------------------users stories----------------------------------------------//

export const insertUsersStoriesModel = async (data) => {
    return db.query("INSERT INTO tbl_user_stories SET ?", [data])
};

export const fetchUsersOwnAllStories = async (id) => {
    return db.query(`SELECT * FROM tbl_user_stories Where userId = ? And isExpire = 0 `, [id]);
};

export const fetchStoriesViews = async (id) => {
    return db.query(`SELECT * FROM tbl_story_viewer Where story_id = ? `, [id]);
};

export const StoriesViewsModel = async (id, userId) => {
    return db.query(`SELECT * FROM tbl_story_viewer Where story_id = ? AND userId=? `, [id, userId]);
};

export const insertStoriesViewersModel = async (data) => {
    return db.query("INSERT INTO tbl_story_viewer SET ?", [data])
};

export const fetchAllActiveStories = async () => {
    return db.query(`SELECT * FROM tbl_user_stories Where isExpire = 0 `);
};

export const expireStoryAfter24Hours = async (id) => {
    return db.query(`UPDATE tbl_user_stories SET isExpire = 1 WHERE id = ?`, [id]);
};

export const insertAudioModel = async (data) => {
    return db.query("INSERT INTO tbl_audio SET ?", [data])
};

export const insertMentionedStoriesData = async (data) => {
    return db.query("INSERT INTO tbl_story_mentions SET ?", [data]);
};

export const fetchAnotherUsersAllStories = async (id) => {
    return db.query(`SELECT * FROM tbl_user_stories Where userId != ? And isExpire = 0 ORDER BY createdAt DESC`, [id]);
};

export const fetchSellerByIdAndDetails = async (id) => {
    return db.query(`SELECT tbl_users.* FROM tbl_sellers 
        JOIN tbl_users ON tbl_sellers.userId=tbl_users.id
        WHERE tbl_sellers.id = ?`, [id]);
};


// --------------------------------new module start-------------------------------------------------//

export const insertMentionedUserData = async (data) => {
    return db.query("INSERT INTO tbl_mentioned SET ?", [data]);
};


export const fetchAllMentionedPostAndStories = async (id) => {
    return db.query(`SELECT * FROM tbl_mentioned  Where mentioned_user_id = ? ORDER BY createdAt DESC `, [id]);
};


export const fetchStoriesByIds = async (id) => {
    return db.query(`SELECT * FROM tbl_user_stories Where id = ? `, [id]);
};

export const deletePostAndStoryFromMentionedTable = async (ID) => {
    return db.query('DELETE FROM tbl_mentioned WHERE story_id = ?', [ID]);
};

export const isSellerAccountCreatedOrNot = async (id) => {
    return db.query("SELECT * FROM tbl_seller_account WHERE seller_id=? ", [id]);
};

export const saveSellerConnectedAccount = async (data) => {
    return db.query("INSERT INTO tbl_seller_account SET ?", [data]);
};


export const markSellerOnboardingComplete = async (id) => {
    return db.query(`UPDATE tbl_seller_account SET is_onboarding_complete = 1 WHERE account_id = ?`, [id]);
};

// --------------------------------starting model-------------------------------------

export const checkIsBoostProductAllreadyViewedOrNOt = async (id, userId) => {
    return db.query(`SELECT * FROM tbl_product_boost_analytics Where boosted_product_id  = ? AND user_id=? `, [id, userId]);
};

export const insertBoostAnalyticsProduct = async (data) => {
    return db.query("INSERT INTO tbl_product_boost_analytics SET ?", [data])
};

export const fetchBoostProductsById = async (ID) => {
    return db.query(`SELECT * FROM tbl_boost_product WHERE id = ? `, [ID]);
};

export const fetchSweepstacksByUsersId = async (id) => {
    return db.query(`SELECT * FROM tbl_users_sweepstacks WHERE id = ?`, [id]);
};

export const fetchFreeSweepstacks = async (sweepstacksName, id) => {
    return db.query(`SELECT * FROM tbl_users_sweepstacks WHERE entryPack = 'Free Entry' AND sweepstacksName=? AND user_id =?`, [sweepstacksName, id]);
};


// ----------------------------------------new features---------------------------------------//

export const changeStatusOfUsersFreeSweepstacks = async (ID) => {
    return db.query('UPDATE tbl_users SET isPurchaseFreeSweepstacks = 1 WHERE id = ? ', [ID]);
};

export const fetchAllUserEntriesForSweepstack = async (sweepstacksName) => {
    return await db.query(`
        SELECT entryPack, totalEntry 
        FROM tbl_users_sweepstacks 
        WHERE sweepstacksName = ?
    `, [sweepstacksName]);
};

/**========================model end========================= */







export const fetchAllPostPromotionPackagesModel = async () => {
    return db.query(`SELECT * FROM tbl_post_promotion_packages`);
};

export const insertBoostPost = async (data) => {
    return db.query(`Insert into tbl_boost_post set ? `, [data]);
};

export const updatePostBoost = async (ID) => {
    console.log('ID', ID);

    return db.query('update tbl_mypost set is_boost = 1 where id  = ?', [ID]);
};

export const fetchBoostPostByUserId = async (ID) => {
    return db.query(`SELECT * FROM tbl_boost_post WHERE user_id = ? `, [ID]);
};

export const fetchBoostPostByPostId = async (ID) => {
    return db.query(`SELECT * FROM tbl_boost_post WHERE post_id = ? AND current_status = 1 `, [ID]);
};

export const getPostPromotionPackageById = async (ID) => {
    return db.query(`
    SELECT *
    FROM tbl_post_promotion_packages
    WHERE id = ?
    `, [ID]);
};

export const insertLiveStream = async (data) => {
    return db.query("INSERT INTO tbl_live SET ?", [data]);
}

export const updateLiveStream = async (live_id) => {
    return db.query("UPDATE tbl_live SET end_date = now() , status = 2 WHERE live_id = ?", [live_id]);
}

export const fetchLiveStreamById = async (live_id) => {
    return db.query("SELECT * FROM tbl_live WHERE live_id = ?", [live_id]);
}

export const checkLiveStatus = async (user_id) => {
    return db.query("SELECT * FROM tbl_live WHERE status = 1 AND user_id = ?", [user_id])
}

export const fetchLiveStreamByUserId = async (user_id, live_id) => {
    return db.query("SELECT * FROM tbl_live_view WHERE user_id = ? AND live_id = ? ", [user_id, live_id]);
}

export const insertLiveStreamViewers = async (data) => {
    return db.query("INSERT INTO tbl_live_view SET ?", [data]);
};

export const fetchAllBoostPosts = async () => {
    return db.query(`SELECT * FROM tbl_boost_post WHERE current_status = 1`);
};

export const updatePostTableIsBoost = async (ID) => {
    return db.query('update tbl_mypost set is_boost = 0 where id  = ?', [ID]);
};

export const updateBoostedProduct = async (ID) => {
    return db.query('update tbl_boost_post set current_status = 0 where id  = ?', [ID]);
}

export const fetchSweepPurchaseById = async (id) => {
    return db.query('SELECT s.* ,t.* FROM tbl_users_sweepstacks s LEFT JOIN tbl_sweepstakes t ON s.sweepStacksId = t.sweepstakes_id  WHERE s.user_id = ? ORDER BY s.createdAt desc', [id]);
}

export const getUserStoryById = async (id, user_id) => {
    return db.query('SELECT * FROM tbl_user_stories WHERE id = ? AND userId = ?', [id, user_id]);
}

export const deleteUserStoryById = async (id) => {
    return db.query('DELETE FROM tbl_user_stories WHERE id = ?', [id]);
}

export const fetchWalletHistoryById = async (id) => {
    return db.query('SELECT * FROM tbl_wallet WHERE user_id = ? ORDER BY created_at DESC', [id]);
}

export const fetchWalletBalanceById = async (id) => {
    return db.query('SELECT  IFNULL(SUM(CASE WHEN status = 0 THEN amount END), 0) AS creditedAmount,  IFNULL(SUM(CASE WHEN status = 1 THEN amount END), 0) AS debitedAmount,  IFNULL(SUM(CASE WHEN status = 0 THEN amount END), 0) - IFNULL(SUM(CASE WHEN status = 1 THEN amount END), 0) AS balance FROM tbl_wallet WHERE user_id = ? ', [id])
}

export const insertWalletHistory = async (data) => {
    return db.query("INSERT INTO tbl_wallet SET ?", [data]);
};

export const modelFetchAllSweepstacksById = async (id) => {
    return db.query("SELECT * FROM tbl_sweepstakes WHERE sweepstakes_id = ?", [id]);
};

export const fetchAllOtherUsers = async (id) => {
    return db.query("SELECT * FROM tbl_users WHERE id != ?", [id])
}

export const fetchAllPublicLives = async () => {
    return db.query('SELECT l.*,u.userName,u.email,u.fullName,u.bio,u.profileImage FROM tbl_live l LEFT JOIN tbl_users u ON u.id = l.user_id WHERE l.status = 1 ORDER BY l.created_at DESC')
}

export const fetchMyFollowingLives = async (ids) => {
    return db.query('SELECT l.*,u.userName,u.email,u.fullName,u.bio,u.profileImage FROM tbl_live l LEFT JOIN tbl_users u ON u.id = l.user_id WHERE l.user_id IN (?) AND l.status = 1', [ids])
}

export const fetchLiveCountByLiveID = async (live_id) => {
    return db.query('SELECT COUNT(*) as count FROM tbl_live_view WHERE live_id =?', [live_id])
}

export const fetchPostLikeCountBYPostId = async (post_id) => {
    return db.query('SELECT COUNT(*) as count FROM tbl_userslike WHERE postId  =?', [post_id])
}


// export const fetchMyFollowingsPostModel = async (userId, limit, offset) => {
//     return db.query("SELECT * FROM tbl_mypost WHERE userId IN (?) ORDER BY createdAt DESC LIMIT ? OFFSET ?", [userId, limit, offset]);
// };

export const fetchMyFollowingsPostModel = async (userIds, limit, offset) => {
    if (!Array.isArray(userIds) || userIds.length === 0) {
        return [];
    }

    return db.query(
        `SELECT * FROM tbl_mypost 
       WHERE userId IN (?) 
       ORDER BY createdAt DESC 
       LIMIT ? OFFSET ?`,
        [userIds, limit, offset]
    );
};


export const checkUserChatMember = async (user_id) => {
    return db.query('SELECT m.* ,c.is_group FROM chat_member m JOIN chat c ON c.id = m.chat_id  WHERE m.user_id = ? AND c.is_group = 0', [user_id]);
}

export const checkUserChatId = async (chat_id) => {
    return db.query('SELECT * FROM chat WHERE id  = ? AND is_group = 0 ', [chat_id]);
}

export const insertUserChatMember = async (data) => {
    return db.query("INSERT INTO chat_member SET?", [data]);
}

export const insertIntoMessage = async (data) => {
    return db.query("INSERT INTO message SET?", [data]);
}

export const insertIntoChat = async (data) => {
    return db.query("INSERT INTO chat SET?", [data]);
}

export const retriveALLUserChat = async (user_id) => {
    return db.query('SELECT m.* ,c.is_group,c.chat_name,c.created_by,c.groupProfile,c.groupDescription FROM chat_member m JOIN chat c ON c.id = m.chat_id  WHERE m.user_id = ?', [user_id]);
}

export const fetchOtherUserChat = async (user_id, chat_id) => {
    return db.query('SELECT m.*,u.userName,u.email,u.fullName,u.profileImage FROM chat_member m  JOIN tbl_users u ON u.id = m.user_id  WHERE m.chat_id  =? AND m.user_id != ? ', [chat_id, user_id]);
}

export const fetchUnreadUsersNotificationByUsersId = async (token) => {
    return db.query("SELECT COUNT(t.id) as unread_count FROM tbl_notification t JOIN tbl_users u ON u.id = t.sendTo WHERE u.fcmToken = ? AND t.isSendTo = 0 AND t.isRead = 0 ", [token]);
};

// -----------------------------karan working----------------------------------------//

export const fetchPromotedPost = async () => {
    return db.query(`SELECT mp.*
FROM tbl_mypost AS mp
JOIN tbl_boost_post AS bp ON mp.id = bp.post_id
WHERE bp.current_status = 1`);
};

export const insertContactSupport = async (data) => {
    return db.query("INSERT INTO tbl_contact_support SET?", [data]);
}

export const countSharedPost = async (postId) => {
    return db.query(`UPDATE tbl_mypost SET totalShared = totalShared + 1 WHERE id = ?`, [postId])
}


export const fetchAllReportReason = async () => {
    return db.query('SELECT * FROM report_post_status')
}


export const addUsersReport = async (data) => {
    return db.query("INSERT INTO users_post_reported SET?", [data]);
}


export const fetchAllReportReasonByIds = async (reportReasonId) => {
    return db.query('SELECT * FROM report_post_status WHERE id = ?', [reportReasonId])
}

// -------------------------user apply to become a investor-------------------------------------//

export const insertApplyToBecomeInvestor = async (data) => {
    return db.query("INSERT INTO tbl_investor_applications SET?", [data]);
}

export const insertApplyToBecomeInvestorMedia = async (data) => {
    return db.query("INSERT INTO investor_media SET?", [data]);
}

export const applyAgainModel = async (updatedFields, id) => {
    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    values.push(id);
    const query = `UPDATE investor_application SET ${setClause} WHERE user_id = ?`;
    return db.query(query, values);
};

export const fetchRanchesByIdUsersModel = async (ranch_id) => {
    return db.query(`SELECT * FROM ranches WHERE id = ?`, [ranch_id]);
}

export const deleteInvesterMediaById = async (id) => {
    return db.query('DELETE FROM investor_media WHERE investor_id = ?', [id]);
}

export const fetchAllGovermentIdTypes = async () => {
    return db.query('SELECT * FROM tbl_govermentsIdType')
}

export const fetchInvesterFormModel = async (id) => {
    return db.query('SELECT * FROM tbl_investor_applications Where user_id =?', [id])
}

export const fetchAllActiveRanchesModel = async () => {
    return db.query(`SELECT * FROM ranches Where status='PUBLISHED' AND isDeleted = 0 ORDER BY created_at DESC`);
}

export const fetchInvesterMediaModel = async (id) => {
    return db.query('SELECT documents FROM investor_media Where investor_id =?', [id])
}

export const fetchAllLiveActive = async () => {
    return db.query('SELECT live_id FROM tbl_live WHERE status = 1')
}

export const updateLiveStreamStatus = async (live_id) => {
    return db.query("UPDATE tbl_live SET status = 2 WHERE live_id = ?", [live_id]);
}

export const deleteInvesterByIds = async (id) => {
    return db.query('DELETE FROM tbl_investor_applications WHERE user_id = ?', [id]);
}



export const insertDocument = async (investorRanchId, fileType, fileUrl) => {
    const queryInsert = `INSERT INTO investor_documents (investor_id, fileType,files, created_at, updated_at) VALUES (?,?,?, ?, ?)`;
    const values = [investorRanchId, fileType, fileUrl, new Date(), new Date()];
    await db.query(queryInsert, values);
}

export const addApplicationRanchesForm = async (data) => {
    return db.query("INSERT INTO investor_application SET?", [data]);
}

export const fetchInvesterApplicationFormModel = async (id) => {
    return db.query('SELECT * FROM investor_application Where id =?', [id])
}

export const fetchInvesterApplicationFormModelByUserId = async (id) => {
    return db.query('SELECT * FROM investor_application Where user_id =?', [id])
}

export const deleteInvesterApplicationByIds = async (id) => {
    return db.query('DELETE FROM investor_application WHERE user_id = ?', [id]);
}

export const fetchInvesterApplicationMediaModel = async (id) => {
    return db.query('SELECT * FROM investor_documents Where investor_id =?', [id])
}

export const fetchCountriesCodeWithCountriesModel = async () => {
    return db.query('SELECT * FROM country_codes ')
}

export const fetchInvestingAsModel = async () => {
    return db.query('SELECT * FROM tbl_investingas ')
}

export const fetchPrefferedOwnershipModel = async () => {
    return db.query('SELECT * FROM tbl_preferred_ownership ')
}

// ------------------------------------------ranches purchases by investers-------------------------------------//

export const ranchesPurchasesByInvesters = async (data) => {
    return db.query("INSERT INTO tbl_ranch_purchases SET?", [data]);
}

export const updateTotalShares = async (totalShares, id) => {
    return db.query("UPDATE ranches SET remainingShares = ? WHERE id = ?", [totalShares, id]);
}

export const modelFetchInvestedRanchesByInvesterId = async (id) => {
    return db.query('SELECT  SUM(total_amount) AS total_amount,tbl_ranch_purchases. * FROM tbl_ranch_purchases where investor_id=? ORDER BY created_at DESC', [id])
}

export const modelFetchInvestedRanchesById = async (id) => {
    return db.query('SELECT * FROM tbl_ranch_purchases where id=? AND reservation_status=?', [id, 'APPROVED'])
}

export const modelRanchesPurchaseHistory = async (investorId) => {
    return db.query(`SELECT
        r.id  AS ranch_id,
        r.name AS ranch_name,
        SUM(p.shares_purchased) AS total_shares_owned,
        MAX(p.created_at)       AS last_purchase_date
      FROM tbl_ranch_purchases p
      JOIN ranches r ON p.ranch_id = r.id
      WHERE p.investor_id = ?
        AND p.payment_status = 'PAID'
      GROUP BY r.id, r.name
      ORDER BY last_purchase_date DESC`,
        [investorId]
    )
}

export const fetchInvesterByThereIds = async (id) => {
    return db.query('SELECT * FROM investor_application Where id =?', [id])
}

export const modelFetchInvestedRanchesByRanchesId = async (ranch_id, investor_id) => {
    return db.query('SELECT * FROM tbl_ranch_purchases where  ranch_id=? AND  investor_id=? AND reservation_status = ? ORDER BY created_at DESC', [ranch_id, investor_id, 'APPROVED'])
}

export const otherInvesterPurchasesRanchesFind = async (ranchId, currentInvestorId) => {
    return db.query(`
  SELECT SUM(shares_purchased) AS total_other_investor_shares
  FROM tbl_ranch_purchases
  WHERE ranch_id = ? AND investor_id != ?
`, [ranchId, currentInvestorId])
}

// ----------------------------------------------------UPDATE TO DATE---------------------------------------------------//

export const totalCalculationSharedPurchase = async (id) => {
    return db.query(`
    SELECT 
      MAX(rp.id) AS id,MAX(rp.price_per_share) AS price_per_share,
      MAX(rp.created_at) AS created_at,
      rp.ranch_id,
      MAX(r.location) AS location,
      MAX(r.name) AS name,
      r.total_shares,
      SUM(rp.shares_purchased) AS total_shares_purchased,
      SUM(rp.total_amount) AS total_investments,
      ROUND((SUM(rp.shares_purchased) / r.total_shares) * 100, 2) AS ownership_percentage
    FROM tbl_ranch_purchases rp
    JOIN ranches r ON r.id = rp.ranch_id
    WHERE rp.investor_id = ?
      AND rp.reservation_status = 'APPROVED'
    GROUP BY rp.ranch_id
    ORDER BY created_at DESC
  `, [id]);
};


export const fetchInvestedRanchesByRanchesId = async (ranch_id, investor_id) => {
    return db.query(`
      SELECT 
        r.id AS ranch_id,
        r.total_shares,
        rp.payment_status,
        rp.escrow_reference_id,
        MAX(rp.ranchesOwnershipPdf) AS ranchesOwnershipPdf,
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
      WHERE rp.ranch_id = ? AND rp.reservation_status=?
      GROUP BY r.id
    `, [investor_id, investor_id, investor_id, investor_id, ranch_id, 'APPROVED']);
};

export const investerInsertContactSupport = async (data) => {
    return db.query("INSERT INTO invester_contact_supports SET?", [data]);
}

export const fetchAllPendingRanchesModel = async (id) => {
    return db.query(`
      SELECT 
        MAX(rp.id) AS id,
        MAX(rp.created_at) AS created_at,
        MAX(rp.reservation_status) AS reservation_status,
        MAX(rp.payment_status) AS payment_status,
        rp.ranch_id,
        r.name,
        r.location,
        r.total_shares,
        SUM(rp.shares_purchased) AS shares_purchased,
        SUM(rp.total_amount) AS total_amount
      FROM tbl_ranch_purchases rp
      JOIN ranches r ON r.id = rp.ranch_id
      WHERE rp.investor_id = ? 
        AND rp.reservation_status = 'PENDING'
      ORDER BY MAX(rp.created_at) DESC
    `, [id]);
};


export const addRanchesOwnershipPdf = async (ranchesOwnershipPdf, id) => {
    return db.query("UPDATE tbl_ranch_purchases SET ranchesOwnershipPdf = ? WHERE id = ?", [ranchesOwnershipPdf, id]);
}

// ----------------------------------------------------ranches booking dates availability---------------------------------------------------//

export const fetchRanchesBlackoutDaysModel = async (ranch_id) => {
    return db.query('SELECT * FROM ranches_blackout_days WHERE ranch_id = ?', [ranch_id]);
}

export const fetchRanchesBookedDatesModel = async (ranch_id, investor_id) => {
    return db.query(`
      SELECT tbd.booked_dates
      FROM bookings b
      JOIN tbl_booked_dates tbd ON b.id = tbd.booking_id
      WHERE b.ranch_id = ? AND b.status = 'approved' AND b.investor_id != ?
    `, [ranch_id, investor_id]);
};

export const fetchMyRanchesBookedDatesModel = async (ranch_id, investor_id) => {
    return db.query(`
      SELECT 
        b.id,
        b.ranch_id,
        b.investor_id,
        tbd.booked_dates,
        b.status,
        b.reason_for_rejection,
        b.created_at,
        b.approved_at
      FROM bookings b
      JOIN tbl_booked_dates tbd ON b.id = tbd.booking_id
      WHERE b.ranch_id = ? AND b.investor_id = ?
    `, [ranch_id, investor_id]);
};

export const fetchMyApprovalRanchesBookedDatesModel = async (ranch_id, investor_id) => {
    return db.query(`
      SELECT 
        tbd.booked_dates
      FROM bookings b
      JOIN tbl_booked_dates tbd ON b.id = tbd.booking_id
      WHERE b.ranch_id = ? AND b.investor_id = ? AND b.status = 'approved'
    `, [ranch_id, investor_id]);
};

export const fetchBookingRanchesById = async (ranch_id, investor_id, status) => {
    return db.query(
        `
      SELECT 
        b.id,
        b.ranch_id,
        b.investor_id,
        b.status,
        b.reason_for_rejection,
        b.created_at,
        b.approved_at,
        tbd.booked_dates
      FROM bookings b
      JOIN tbl_booked_dates tbd ON b.id = tbd.booking_id
      WHERE b.ranch_id = ? AND b.investor_id = ? AND b.status = ?
      ORDER BY ${status === 'approved' ? 'b.approved_at' : 'b.created_at'} DESC
      `,
        [ranch_id, investor_id, status]
    );
};

export const insertRanchBookingModel = async (data) => {
    return db.query("INSERT INTO bookings SET ?", [data]);
};

export const insertRanchBookedDatesModel = async (data) => {
    return db.query("INSERT INTO tbl_booked_dates SET ?", [data]);
};

export const updateNotActiveInvestorChats = async (chatId) => {
    return db.query(`UPDATE tbl_investor_chat  SET isIvestorActive = 0 WHERE id = ?`, [chatId]);
};


export const fetchUnreadRanchesChatCountById = async (id, investerId) => {
    return db.query('SELECT * FROM tbl_investor_chat_messages Where room_id =? AND sender_id !=? AND is_read = 0', [id, investerId])
};

export const fetchChatIdThroughRanchesIdAndInvestor = async (ranchId, investorId) => {
    return db.query("SELECT id FROM tbl_investor_chat WHERE ranch_id = ? AND investor_id = ? LIMIT 1", [ranchId, investorId])
}

export const fetchUsersIdsByInvestorId = async (id) => {
    return db.query('SELECT * FROM investor_application Where id =?', [id])
}


// --------------------------------NEW CART FLOW DEVELOPER KARAN PATEL-------------------------------------//

export const getAllCartProductVarientsModel = async (userId) => {
    return db.query(`SELECT * FROM tbl_users_cart  WHERE user_id = ? ORDER BY created_at DESC`, [userId]);
};

export const getVariantDetailsById = async (variant_id) => {
    return db.query(`
    SELECT 
      v.id AS variant_id,
      v.stock_quantity,
      v.low_stock_alert,
      s.size_system,
      s.size_value,
      s.fit_type,
      c.id AS color_id,
      c.color_name
    FROM tbl_product_variants v
    JOIN tbl_size_master s ON s.id = v.size_id
    JOIN tbl_product_colors c ON c.id = v.color_id
    WHERE v.id = ?
  `, [variant_id]);
};

export const getUserProductImagesByColorModal = async (pid, color_id) => {
    return db.query(
        `SELECT * FROM tbl_productimg
     WHERE pId = ? AND color_id = ?
     ORDER BY created_at DESC`,
        [pid, color_id]
    );
};

export const checkAvailableVariantInCartModel = async (id) => {
    return db.query(`SELECT * FROM tbl_users_cart WHERE id = ?`, [id]);
};

export const updateCartQuantityModel = async (cart_id, quantity) => {
    return db.query(`UPDATE tbl_users_cart SET quantity = ? WHERE id = ?`, [quantity, cart_id]);
};

export const getVariantById = async (variant_id) => {
  return db.query(
    `SELECT v.*, c.color_name, s.size_value
     FROM tbl_product_variants v
     JOIN tbl_product_colors c ON c.id = v.color_id
     JOIN tbl_size_master s ON s.id = v.size_id
     WHERE v.id = ?`,
    [variant_id]
  );
};

export const updateVariantStockModel = async (variant_id, qty) => {
    return db.query(
        `UPDATE tbl_product_variants SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?`, [qty, variant_id, qty]
    );
};

export const fetchOrderItemByID = async (orderId) => {
  return db.query(`
    SELECT 
      oi.*,
      p.product_name,
      c.color_name,
      s.size_value,
      s.size_system,
      s.fit_type,
      v.color_id,
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
