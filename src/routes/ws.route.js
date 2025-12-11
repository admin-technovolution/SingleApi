const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /ws/chats:
 *   get:
 *     tags:
 *       - Web Sockets
 *     summary: WebSocket for chats
 *     description: |
 *       **Chats WebSocket**
 *       - **URL:** ws://localhost:3000/ws/chats
 *       - **Protocol:** JSON messages
 *       
 *       #### Supported Actions:
 *       | Type | Action | Payload Example | Description |
 *       | - | - | - | - |
 *       |🟧 **CLIENT EMITS**       | `sendMessage`     | `Refer to ChatSendMessageSchema`              | Send a message to a user/chat              |
 *       |🟧 **CLIENT EMITS**       | `updateMessage`   | `Refer to ChatUpdateMessageSchema`            | Update a message to a user/chat            |
 *       |🟧 **CLIENT EMITS**       | `openChat`        | `Refer to OpenChatSchema`                     | Send an event when a user open a chat      |
 *       |🟩 **CLIENT LISTEN**      | `sendMessage`     | `Refer to BaseResponse`                       | Response when user send a message to ack   |
 *       |🟩 **CLIENT LISTEN**      | `updateMessage`   | `Refer to BaseResponse`                       | Response when user update a message to ack |
 *       |🟩 **CLIENT LISTEN**      | `messageRead`     | `Refer to BaseResponse`                       | Action when a new message is read          |
 *       |🟩 **CLIENT LISTEN**      | `newUpdateMessage`| `Refer to BaseResponse`                       | Action when a new message is updated       |
 *       |🟦 **PUSH NOTIFICATION**  | `newLike`         | `Refer to BaseResponse`                       | Action when a new like is received         |
 *       |🟦 **PUSH NOTIFICATION**  | `newMessage`      | `Refer to BaseResponse`                       | Action when a new message is received      |
 *       |🟦 **PUSH NOTIFICATION**  | `newMatch`        | `Refer to BaseResponse`                       | Action when a new match                    |
 *       |🟨 **CLIENT EMITS/LISTEN**| `disconnect`      |                                               | When user disconnects                      |
 *       
 *       **Notes:**
 *       - All communication is JSON-based.
 *       - Use Socket.IO Test Client Google Chrome extension for testing.
 */

router.get('/ws/chats', (req, res) => {
    res.send('See Swagger UI for WebSocket documentation');
});

module.exports = router;