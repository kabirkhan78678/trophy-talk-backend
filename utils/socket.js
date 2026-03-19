import { Server } from "socket.io";
import {
    saveMessage,
    fetchMessages,
    insertUsersSocketId,
    fetchMessagesById,
    markMessageAsRead,
    // checkIsUserChatExistsOrNot,
    // createSingleChat,
    // createGroupChat,
    getUserChats,
    fetchAllChatsMembers,
    fetchUsersById,
    fetchChatByIds,
    fetchChatMemberByChatsIds,
    fetchUserById,
    updateUsersProfile,
    fetchChatIdByMessageId,
    fetchOtherUserBlockedListUsers,
    fetchUnreadCount,
    updateUnreadCount,
    isUserActive,
    createActivateUsers,
    toActivateUsers,
    // insertAllUserUnreadMessage,
    // fetchMessagess,
    // updateMessage_read_status,
    // getUserChatss
} from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import { NotificationTypes } from "./constant.js";
import { createNotificationMessage, sendNotification, updateOnlineStatus } from "./user_helper.js";
import { getUserSockets, setIO } from "./socketManager.js";
import { createInvestorChatRoom, fetchAdminGroupedChatList, fetchInvestorChatByChatIds, fetchInvestorChatList, fetchInvestorChatMessages, fetchInvestorListForAdmin, fetchInvestorRanchesByInvestorIdListForAdmin, fetchRanchesImagesByRanchesId, getInvestorByThereId, modifyNotActiveAdminChats, saveInvestorMessage, updateActiveAdminChats, updateActiveInvestorChats, updateIsReadAdminChats, updateIsReadInvetorChats, updateNotActiveInvestChats } from "../models/investor.model.js";
import { fetchAdminDetails, updateNotActiveAdminChats } from "../models/admin.model.js";

//Aishwarya Holkar Changes Starts
// import { createClient } from "redis";
// import { createAdapter } from "@socket.io/redis-adapter";
   

// const pubClient = createClient({ url: "redis://localhost:6379" });
// const subClient = pubClient.duplicate();
//Aishwarya Holkar Changes Ends

dotenv.config();
const SECRET_KEY = process.env.AUTH_SECRETKEY;
const JWT_SECRET_ADMIN = process.env.JWT_SECRET;


const initializeSocket = (server) => {
    // Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
        const io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        setIO(io);
        // io.adapter(createAdapter(pubClient, subClient));

        const userSockets = getUserSockets();

        // let userSockets = new Map();
        io.on("connection", (socket) => {
            let currentChatRoom = null;
            const authHeader = socket.handshake.headers.authorization;
            const userType = socket.handshake.headers['user-type'];
            if (!authHeader) {
                console.log("Authorization header is missing");
                socket.emit('unauthorized', {
                    status: 401,
                    message: 'Authorization header is missing',
                    success: false,
                });
            }
            const token = authHeader.replace('Bearer ', '');
            let decoded;
            let loggedUserId;
            if (userType == 'admin') {
                decoded = jwt.verify(token, JWT_SECRET_ADMIN);
                loggedUserId = decoded.id;
            } else {
                decoded = jwt.verify(token, SECRET_KEY);
                loggedUserId = decoded.data.id;
            }

            // let loggedUserId = decoded.data.id;
            socket.join(loggedUserId.toString());

            const userSockets = getUserSockets();
            userSockets.set(loggedUserId, socket.id);

            socket.on('user_connected', async () => {
                try {
                    let userId = decoded.data.id
                    userSockets.set(userId, socket.id);
                    await insertUsersSocketId(socket.id, decoded.data.id);
                    const chats = await getUserChats(decoded.data.id);
                    io.in(userId.toString()).emit("chat_list", chats);
                } catch (error) {
                    socket.emit("error", error.message);
                }
            });

            socket.on("fetch_chats", async () => {
                try {
                    let userId = decoded.data.id
                    console.log("user - ", userId);

                    const chats = await getUserChats(userId);

                    console.log("chats - ", chats);
                    socket.emit("chat_list", chats);
                } catch (error) {
                    socket.emit("error", error.message);
                }
            });

            socket.on('join_chat', async ({ chatId }) => {
                try {
                    const currentUserId = decoded.data.id;
                    let isActive = 1
                    if (currentChatRoom) {
                        socket.leave(currentChatRoom);
                    }
                    currentChatRoom = `chat_${chatId}`;
                    socket.join(currentChatRoom);
                    socket.chatId = chatId;
                    let isUserActiveOrNot = await isUserActive(chatId, currentUserId)
                    if (isUserActiveOrNot.length > 0) {
                        await toActivateUsers(isActive, chatId, currentUserId)
                    } else {
                        await createActivateUsers(chatId, currentUserId, isActive)
                    }

                    let messages = await fetchMessages(chatId);
                    let chatsDetaileds = await fetchChatByIds(chatId)
                    let messagesList = [];
                    if (messages.length > 0) {
                        messagesList = messages.map(item => ({
                            ...item,
                            isOwnMessage: item.sender_id === currentUserId ? true : false
                        }));
                    }
                    let userMessageDetailed = {};

                    if (chatsDetaileds[0].is_group == 1) {
                        // Group chat

                        userMessageDetailed = {
                            chat_id: chatsDetaileds[0].id,
                            is_group: chatsDetaileds[0].is_group,
                            chat_name: chatsDetaileds[0].chat_name,
                            created_by: chatsDetaileds[0].created_by,
                            groupProfile: chatsDetaileds[0].groupProfile,
                            groupDescription: chatsDetaileds[0].groupDescription,
                            createdAt: chatsDetaileds[0].createdAt,
                            updatedAt: chatsDetaileds[0].updatedAt,
                            user_id: chatsDetaileds[0].id,
                            user_name: 'Unknown',
                            profileImage: null,
                            // is_user_blocked_me: is_user_blocked_me.length > 0,
                            // is_user_blocked_by_me: is_user_blocked_by_me.length > 0
                        };
                        //     } else {
                        //         const chats = await fetchChatMemberByChatsIds(chatId);
                        //         let isActive;
                        //         if (chats.length !== 2) return;
                        //         const user1 = chats[0].user_id;
                        //         const user2 = chats[1].user_id;
                        //         const user1Status = await isUserActive(chatId, user1);
                        //         const user2Status = await isUserActive(chatId, user2);
                        //         const isUser1Active = user1Status.length > 0 ? user1Status[0].isActive : 0;
                        //         isActive = isUser1Active
                        //         const isUser2Active = user2Status.length > 0 ? user2Status[0].isActive : 0;
                        //         isActive = isUser2Active
                        //         const socket1 = userSockets.get(user1);
                        //         if (socket1 && io.sockets.sockets.get(socket1)) {
                        //             io.to(socket1).emit('isUsersOnlineOrOffline', isActive);
                        //         }
                        //         const socket2 = userSockets.get(user2);
                        //         if (socket2 && io.sockets.sockets.get(socket2)) {
                        //             io.to(socket2).emit('isUsersOnlineOrOffline', isActive);
                        //         }
                        //         const opponentUserId = user1 === currentUserId ? user2 : user1;
                        //         const fetchUserDeta = await fetchUserById(opponentUserId);
                        //         const is_user_blocked_me = await fetchOtherUserBlockedListUsers(opponentUserId, currentUserId);
                        //         const is_user_blocked_by_me = await fetchOtherUserBlockedListUsers(currentUserId, opponentUserId);

                        //         userMessageDetailed = {
                        //             chat_id: chatsDetaileds[0].id,
                        //             is_group: chatsDetaileds[0].is_group,
                        //             chat_name: fetchUserDeta[0]?.user_name,
                        //             created_by: chatsDetaileds[0].created_by,
                        //             groupProfile: null,
                        //             createdAt: chatsDetaileds[0].createdAt,
                        //             updatedAt: chatsDetaileds[0].updatedAt,
                        //             user_id: opponentUserId,
                        //             user_name: fetchUserDeta[0]?.user_name,
                        //             profileImage: fetchUserDeta[0]?.profileImage,
                        //             is_user_blocked_me: is_user_blocked_me.length > 0,
                        //             is_user_blocked_by_me: is_user_blocked_by_me.length > 0
                        //         };

                        //     }
                        //     await updateUnreadCount(0, chatId, currentUserId);
                        //     socket.emit("chat_history", messagesList);
                        //     socket.emit("chatId_detailed", userMessageDetailed);
                        // } 
                    } else {
                        // One-to-one chat
                        const chats = await fetchChatMemberByChatsIds(chatsDetaileds[0].id);
                        const otherUsers = chats.filter(chat => chat.user_id !== currentUserId);
                        const fetchUserDeta = await fetchUserById(otherUsers[0].user_id);
                        let is_user_blocked_me = await fetchOtherUserBlockedListUsers(otherUsers[0].user_id, currentUserId);
                        let is_user_blocked_by_me = await fetchOtherUserBlockedListUsers(currentUserId, otherUsers[0].user_id);

                        userMessageDetailed = {
                            chat_id: chatsDetaileds[0].id,
                            is_group: chatsDetaileds[0].is_group,
                            chat_name: fetchUserDeta[0]?.user_name,
                            created_by: chatsDetaileds[0].created_by,
                            groupProfile: null,
                            createdAt: chatsDetaileds[0].createdAt,
                            updatedAt: chatsDetaileds[0].updatedAt,
                            user_id: otherUsers[0].user_id,
                            user_name: fetchUserDeta[0]?.user_name,
                            profileImage: fetchUserDeta[0]?.profileImage,
                            is_user_blocked_me: is_user_blocked_me.length > 0,
                            is_user_blocked_by_me: is_user_blocked_by_me.length > 0
                        };
                    }
                    await updateUnreadCount(0, chatId, currentUserId);
                    socket.emit("chat_history", messagesList);
                    socket.emit("chatId_detailed", userMessageDetailed);

                }
                catch (error) {
                    console.error('Error fetching chat history:', error);
                    socket.emit("error", error.message);
                }
            });

            socket.on("send_message", async ({ chatId, message, messageType }) => {
                try {
                    const senderId = decoded.data.id;
                    const currentUserDetailed = await fetchUsersById(senderId);
                    const fullName = currentUserDetailed[0]?.fullName;

                    const profileImage = currentUserDetailed[0]?.profileImage;


                    const result = await saveMessage(chatId, senderId, message, messageType);
                    const messageId = result.insertId;
                    const messageDetails = await fetchMessagesById(messageId);
                    messageDetails[0].isOwnMessage = true;
                    // const chatPreview = { chatId, lastMessage: message, messageType, senderName: fullName, timestamp: new Date().toISOString() };
                    const chatMembers = await fetchAllChatsMembers(chatId, senderId);
                    const allMemberIds = [...chatMembers.map(m => m.user_id)];
                    io.to(`chat_${chatId}`).emit("getMessage", messageDetails[0]);

                    for (const userId of allMemberIds) {
                        const userDetailed = await fetchUsersById(userId);
                        const isUserOnline = userDetailed[0]?.is_online;
                        const fcmToken = userDetailed[0]?.fcmToken;
                        const recipientSocketID = userSockets.get(userId);
                        const countData = await fetchUnreadCount(chatId, userId);
                        let newCount = countData[0].count + 1
                        await updateUnreadCount(newCount, chatId, userId);
                        const chats = await getUserChats(userId);
                        console.log('chats', chats);

                        const unreadChatsCount = chats.filter(chat => chat.unread_count !== 0).length;
                        io.in(userId.toString()).emit("chat_list", chats);
                        io.in(userId.toString()).emit("chat_unread_count", unreadChatsCount);

                        // io.to(recipientSocketID).emit('chat_unread_count', unreadChatsCount);

                        // Send push notification if user is offline or socket not active

                        let userActiveOrNot = await isUserActive(chatId, userId)
                        if (userActiveOrNot[0].isActive == 0) {
                            const notificationType = NotificationTypes.SEND_MESSAGE_NOTIFICATION;
                            const notificationSend = 'sendMessage';
                            const postId = chatId;
                            const notificationMessage = await createNotificationMessage({
                                notificationSend,
                                fullName,
                                id: senderId,
                                userId,
                                followId: null,
                                usersfetchFcmToken: fcmToken,
                                notificationType,
                                postId,

                                profileImage
                            });
                            await sendNotification(notificationMessage, postId);
                        }
                    }
                } catch (error) {
                    console.error("❌ send_message error:", error.message);
                    socket.emit("error", error.message);
                }
            });

            socket.on('isUser', async ({ userId }) => {
                let userDetails = await fetchUsersById(userId);
                socket.emit("isOnline", userDetails[0]);
            });

            socket.on("fetch_messages", async ({ chatId }) => {
                try {
                    const messages = await fetchMessages(chatId);
                    socket.emit("chat_history", messages);
                } catch (error) {
                    socket.emit("error", error.message);
                }
            });

            socket.on("mark_as_read", async ({ messageId, userId }) => {
                try {
                    await markMessageAsRead(messageId);
                    const chatInfo = await fetchChatIdByMessageId(messageId);
                    const chatId = chatInfo[0]?.chat_id;
                    socket.emit("message_read", { messageId });
                    const messages = await fetchMessages(chatId);
                    socket.emit("chat_history", messages);
                    const chatMembers = await fetchAllChatsMembers(chatId, userId); // Excludes current user
                    const recipientUserId = chatMembers[0]?.user_id;
                    const recipientSocketId = userSockets.get(recipientUserId);
                    console.log('userSockets', userSockets);

                    console.log('recipientSocketId', recipientSocketId);

                    if (recipientSocketId && io.sockets.sockets.get(recipientSocketId)) {
                        io.to(recipientSocketId).emit("message_read", {
                            messageId,
                            seenBy: userId,
                        });

                        io.to(recipientSocketId).emit("chat_history", messages);
                    }


                    // let recipientSocketId;

                    // for (const member of chatMembers) {
                    //     if (userSockets.has(member.user_id)) {
                    //         recipientSocketId = userSockets.get(member.user_id);
                    //         break;
                    //     }
                    // }

                    // if (recipientSocketId && io.sockets.sockets.get(recipientSocketId)) {
                    //     io.to(recipientSocketId).emit("message_read", {
                    //         messageId,
                    //         seenBy: userId,
                    //     });

                    //     io.to(recipientSocketId).emit("chat_history", messages);
                    // } else {
                    //     console.log("Recipient socket ID not found in userSockets.");
                    // }
                } catch (error) {
                    console.error('mark_as_read error:', error.message);
                    socket.emit("error", error.message);
                }
            });

            socket.on("user_status_update", async ({ chatId, isOnline }) => {
                try {
                    const currentUserId = decoded.data.id;
                    let data = {
                        is_online: isOnline
                    }
                    await updateUsersProfile(data, currentUserId);
                    const chatMembers = await fetchAllChatsMembers(chatId, currentUserId);
                    const recipientSocketID = userSockets.get(chatMembers[0].user_id);
                    if (recipientSocketID && io.sockets.sockets.get(recipientSocketID)) {
                        io.to(recipientSocketID).emit('isUsersOnlineOrOffline', {
                            userId: currentUserId,
                            isOnline: isOnline
                        });
                    }
                } catch (err) {
                    console.error("Error in user_status_update:", err.message);
                }
            });

            // -----------------------------investor and admin chats---------------------------------------------------//

            // let currentRoom = null;

            // socket.on("join_investor_chat", async ({ ranchId, investorId }) => {
            //     try {
            //         const roomId = await createInvestorChatRoom(ranchId, investorId);
            //         if (userType == 'admin') {
            //             await modifyNotActiveAdminChats()
            //             await updateActiveAdminChats(roomId)
            //             await updateIsReadAdminChats(roomId)
            //         } else {
            //             await updateNotActiveInvestChats()
            //             await updateActiveInvestorChats(roomId)
            //             await updateIsReadInvetorChats(roomId)
            //         }
            //         currentRoom = `investor_room_${roomId}`;
            //         // socket.join(currentRoom);
            //         const roomName = `investor_room_${investorId}_${ranchId}`;
            //         socket.join(roomName);
            //         const messages = await fetchInvestorChatMessages(roomId);
            //         socket.emit("investor_chat_history", messages);
            //         const investorRoom = `admin_investor_room_${investorId}`;
            //         let ranches = await fetchInvestorRanchesByInvestorIdListForAdmin(investorId)
            //         ranches = await Promise.all(ranches.map(async (item) => {
            //             item.ranchesImages = await fetchRanchesImagesByRanchesId(item.ranch_id)
            //             return item
            //         }))
            //         io.to(investorRoom).emit("admin_investor_ranch_list", { investorId, ranches });

            //         const investorList = await fetchInvestorListForAdmin();
            //         io.to(investorRoom).emit("admin_investor_list", investorList);
            //     } catch (error) {
            //         console.error("❌ join_investor_chat error:", error.message);
            //         socket.emit("error", { message: error.message });
            //     }
            // });

            // socket.on("admin_join_ranch_chat", ({ investorId, ranchId, adminId }) => {
            //     const roomName = `investor_room_${investorId}_${ranchId}`;
            //     socket.join(roomName);
            // });

            // socket.on("send_investor_message", async ({ ranchId, investorId, senderType, message }) => {
            //     try {
            //         const savedMsg = await saveInvestorMessage(ranchId, investorId, senderType, message);
            //         // const roomName = `investor_room_${savedMsg.chatRoomId}`;
            //         const roomName = `investor_room_${investorId}_${ranchId}`;
            //         let isActiveUsers = await fetchInvestorChatByChatIds(savedMsg.chatRoomId)
            //         let data = await fetchRanchesImagesByRanchesId(ranchId)
            //         let profileImage = data[0].url

            //         if (senderType == 'ADMIN') {
            //             let userDetails = await getInvestorByThereId(investorId)
            //             let fullName = 'Trophy talk admin'
            //             let userId = ranchId
            //             let fcmToken = userDetails[0].fcmToken
            //             if (isActiveUsers[0].isIvestorActive == 0) {
            //                 io.to(roomName).emit("receive_investor_message", { ranchId, investorId, sender_type: senderType, message, created_at: savedMsg.created_at, });
            //                 const notificationType = NotificationTypes.CHAT_NOTIFICATION_SEND_TO_INVESTOR;
            //                 const notificationSend = 'sendMessageNotificationToInvestor';
            //                 const postId = savedMsg.chatRoomId;
            //                 const notificationMessage = await createNotificationMessage({
            //                     notificationSend,
            //                     fullName,
            //                     id: investorId,
            //                     userId,
            //                     followId: null,
            //                     usersfetchFcmToken: fcmToken,
            //                     notificationType,
            //                     postId,

            //                     profileImage
            //                 });
            //                 await sendNotification(notificationMessage, postId);
            //             } else {
            //                 await updateIsReadAdminChats(savedMsg.chatRoomId)
            //                 io.to(roomName).emit("receive_investor_message", { ranchId, investorId, sender_type: senderType, message, created_at: savedMsg.created_at, });
            //             }
            //         } else {
            //             let userDetails = await getInvestorByThereId(investorId)
            //             let adminDetails = await fetchAdminDetails()

            //             let fullName = userDetails[0].user_fullName
            //             let userId = adminDetails[0].id
            //             let fcmToken = adminDetails[0].fcmToken



            //             if (isActiveUsers[0].isAdminActive == 0) {
            //                 io.to(roomName).emit("receive_investor_message", { ranchId, investorId, sender_type: senderType, message, created_at: savedMsg.created_at, });
            //                 const notificationType = NotificationTypes.SEND_MESSAGE_NOTIFICATION;
            //                 const notificationSend = 'sendMessageNotificationToAdmin';
            //                 const postId = savedMsg.chatRoomId;
            //                 const notificationMessage = await createNotificationMessage({
            //                     notificationSend,
            //                     fullName,
            //                     id: investorId,
            //                     userId,
            //                     followId: null,
            //                     usersfetchFcmToken: fcmToken,
            //                     notificationType,
            //                     postId,

            //                     profileImage
            //                 });
            //                 await sendNotification(notificationMessage, postId);
            //             } else {
            //                 await updateIsReadInvetorChats(savedMsg.chatRoomId)
            //                 io.to(roomName).emit("receive_investor_message", { ranchId, investorId, sender_type: senderType, message, created_at: savedMsg.created_at, });
            //             }
            //         }
            //         const investorList = await fetchInvestorListForAdmin();
            //         let ranches = await fetchInvestorRanchesByInvestorIdListForAdmin(investorId)
            //         ranches = await Promise.all(ranches.map(async (item) => {
            //             item.ranchesImages = await fetchRanchesImagesByRanchesId(item.ranch_id)
            //             return item
            //         }))
            //         const investorRoom = `admin_investor_room_${investorId}`;
            //         const room = io.sockets.adapter.rooms.get(investorRoom);
            //         io.emit("admin_investor_updated", investorList);
            //         io.to(investorRoom).emit("admin_investor_list", investorList);
            //         io.to(investorRoom).emit("admin_investor_ranch_list", { investorId, ranches });
            //     } catch (error) {
            //         console.error("❌ send_investor_message error:", error.message);
            //         socket.emit("error", { message: error.message });
            //     }

            // });

            // socket.on("fetch_investor_messages", async ({ ranchId, investorId }) => {
            //     try {
            //         const messages = await fetchInvestorChatMessages(ranchId, investorId);
            //         socket.emit("investor_chat_history", messages);
            //     } catch (error) {
            //         socket.emit("error", { message: error.message });
            //     }
            // });

            // socket.on("fetch_investor_list_for_admin", async () => {
            //     try {
            //         const investorList = await fetchInvestorListForAdmin();
            //         socket.emit("admin_investor_list", investorList);
            //     } catch (error) {
            //         console.error("❌ fetch_investor_list_for_admin error:", error.message);
            //         socket.emit("error", { message: error.message });
            //     }
            // });

            // socket.on("fetch_ranches_by_investor_for_admin", async ({ investorId }) => {
            //     try {
            //         const investorRoom = `admin_investor_room_${investorId}`;
            //         for (const room of socket.rooms) {
            //             if (room.startsWith("admin_investor_room_")) {
            //                 socket.leave(room);
            //             }
            //         }
            //         socket.join(investorRoom);
            //         let ranches = await fetchInvestorRanchesByInvestorIdListForAdmin(investorId)
            //         ranches = await Promise.all(ranches.map(async (item) => {
            //             item.ranchesImages = await fetchRanchesImagesByRanchesId(item.ranch_id)
            //             return item
            //         }))
            //         socket.emit("admin_investor_ranch_list", { investorId, ranches });
            //     } catch (error) {
            //         console.error("❌ fetch_ranches_by_investor_for_admin error:", error.message);
            //         socket.emit("error", { message: error.message });
            //     }
            // });

            // ----------------------------------old code which is work properly----------------------------------------//

            //------------------------------------- Investor Chat System --------------------------------------//


            let currentRoom = null;

            socket.on("join_investor_chat", async ({ ranchId, investorId }) => {
                try {
                    const roomId = await createInvestorChatRoom(ranchId, investorId);
                    if (userType === "admin") {
                        await modifyNotActiveAdminChats();
                        await updateActiveAdminChats(roomId);
                        await updateIsReadAdminChats(roomId);
                    } else {
                        await updateNotActiveInvestChats();
                        await updateActiveInvestorChats(roomId);
                        await updateIsReadInvetorChats(roomId);
                    }

                    for (const room of socket.rooms) {
                        if (room.startsWith(`investor_room_${investorId}_`)) socket.leave(room);
                    }

                    const ranchRoom = `investor_room_${investorId}_${ranchId}`;
                    socket.join(ranchRoom);
                    currentRoom = ranchRoom;

                    console.log(`📌 joined ranch room => ${ranchRoom}`);

                    // 4️⃣ Send chat history
                    const messages = await fetchInvestorChatMessages(roomId);
                    socket.emit("investor_chat_history", messages);

                    // 5️⃣ Leave previous admin_investor_room
                    for (const room of socket.rooms) {
                        if (room.startsWith("admin_investor_room_")) socket.leave(room);
                    }

                    // 6️⃣ Join correct admin_investor_room
                    const adminInvestorRoom = `admin_investor_room_${investorId}`;
                    socket.join(adminInvestorRoom);

                    console.log(`📌 joined admin investor room => ${adminInvestorRoom}`);

                    // 7️⃣ Send ranch list
                    let ranches = await fetchInvestorRanchesByInvestorIdListForAdmin(investorId);
                    ranches = await Promise.all(
                        ranches.map(async (item) => {
                            item.ranchesImages = await fetchRanchesImagesByRanchesId(item.ranch_id);
                            return item;
                        })
                    );

                    socket.emit("admin_investor_ranch_list", { investorId, ranches });
                    const investorList = await fetchInvestorListForAdmin();
                    io.emit("admin_investor_list", investorList);  // 🔥 FIXED

                } catch (error) {
                    console.error("❌ join_investor_chat error:", error.message);
                    socket.emit("error", { message: error.message });
                }
            });

            socket.on("admin_join_ranch_chat", ({ investorId, ranchId, adminId }) => {
                for (const room of socket.rooms) {
                    if (room.startsWith(`investor_room_${investorId}_`)) {
                        socket.leave(room);
                    }
                }
                const roomName = `investor_room_${investorId}_${ranchId}`;
                socket.join(roomName);
            });

            socket.on("send_investor_message", async ({ ranchId, investorId, senderType, message }) => {
                try {
                    const savedMsg = await saveInvestorMessage(ranchId, investorId, senderType, message);

                    const roomName = `investor_room_${investorId}_${ranchId}`;
                    let isActiveUsers = await fetchInvestorChatByChatIds(savedMsg.chatRoomId);
                    let ranchImg = await fetchRanchesImagesByRanchesId(ranchId);
                    let profileImage = ranchImg?.[0]?.url || null;

                    // ---- SEND MESSAGE to ONLY the correct ranch-room ----
                    io.to(roomName).emit("receive_investor_message", {
                        ranchId,
                        investorId,
                        sender_type: senderType,
                        message,
                        created_at: savedMsg.created_at,
                        chatRoomId: savedMsg.chatRoomId,
                        profileImage,
                    });

                    // ----- HANDLE NOTIFICATION -----
                    if (senderType === "ADMIN") {
                        let userDetails = await getInvestorByThereId(investorId);
                        let fcmToken = userDetails?.[0]?.fcmToken;

                        if (isActiveUsers[0].isIvestorActive === 0) {
                            const notificationMessage = await createNotificationMessage({
                                notificationSend: "sendMessageNotificationToInvestor",
                                fullName: "Trophy talk admin",
                                id: investorId,
                                userId: ranchId,
                                followId: null,
                                usersfetchFcmToken: fcmToken,
                                notificationType: NotificationTypes.CHAT_NOTIFICATION_SEND_TO_INVESTOR,
                                postId: savedMsg.chatRoomId,
                                profileImage
                            });
                            await sendNotification(notificationMessage, savedMsg.chatRoomId);
                        } else {
                            await updateIsReadAdminChats(savedMsg.chatRoomId);
                        }

                    } else {
                        // Investor -> Admin
                        let adminDetails = await fetchAdminDetails();
                        let fcmToken = adminDetails?.[0]?.fcmToken;
                        let userDetails = await getInvestorByThereId(investorId);

                        if (isActiveUsers[0].isAdminActive === 0) {
                            const notificationMessage = await createNotificationMessage({
                                notificationSend: "sendMessageNotificationToAdmin",
                                fullName: userDetails[0].user_fullName,
                                id: investorId,
                                userId: adminDetails[0].id,
                                followId: null,
                                usersfetchFcmToken: fcmToken,
                                notificationType: NotificationTypes.SEND_MESSAGE_NOTIFICATION,
                                postId: savedMsg.chatRoomId,
                                profileImage
                            });
                            await sendNotification(notificationMessage, savedMsg.chatRoomId);
                        } else {
                            await updateIsReadInvetorChats(savedMsg.chatRoomId);
                        }
                    }

                    // ---- UPDATE ADMIN PANEL ----
                    const investorRoom = `admin_investor_room_${investorId}`;
                    const investorList = await fetchInvestorListForAdmin();

                    let ranches = await fetchInvestorRanchesByInvestorIdListForAdmin(investorId);
                    ranches = await Promise.all(
                        ranches.map(async (item) => {
                            item.ranchesImages = await fetchRanchesImagesByRanchesId(item.ranch_id);
                            return item;
                        })
                    );

                    io.to(investorRoom).emit("admin_investor_list", investorList);
                    io.to(investorRoom).emit("admin_investor_ranch_list", { investorId, ranches });

                } catch (error) {
                    console.error("❌ send_investor_message error:", error.message);
                    socket.emit("error", { message: error.message });
                }
            });

            socket.on("fetch_investor_messages", async ({ ranchId, investorId }) => {
                try {
                    const messages = await fetchInvestorChatMessages(ranchId, investorId);
                    socket.emit("investor_chat_history", messages);
                } catch (error) {
                    socket.emit("error", { message: error.message });
                }
            });

            socket.on("fetch_investor_list_for_admin", async () => {
                try {
                    const investorList = await fetchInvestorListForAdmin();
                    socket.emit("admin_investor_list", investorList);
                } catch (error) {
                    console.error("❌ fetch_investor_list_for_admin error:", error.message);
                    socket.emit("error", { message: error.message });
                }
            });

            socket.on("fetch_ranches_by_investor_for_admin", async ({ investorId }) => {
                try {
                    const investorRoom = `admin_investor_room_${investorId}`;

                    // Leave previous admin investor rooms
                    for (const room of socket.rooms) {
                        if (room.startsWith("admin_investor_room_")) {
                            socket.leave(room);
                        }
                    }

                    socket.join(investorRoom);

                    let ranches = await fetchInvestorRanchesByInvestorIdListForAdmin(investorId);
                    ranches = await Promise.all(
                        ranches.map(async (item) => {
                            item.ranchesImages = await fetchRanchesImagesByRanchesId(item.ranch_id);
                            return item;
                        })
                    );

                    socket.emit("admin_investor_ranch_list", { investorId, ranches });

                } catch (error) {
                    console.error("❌ fetch_ranches_by_investor_for_admin error:", error.message);
                    socket.emit("error", { message: error.message });
                }
            });

        });
    // })

};

export default initializeSocket;
