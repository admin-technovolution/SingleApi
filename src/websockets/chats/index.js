const openChat = require('./actions/openChat');
const sendMessage = require('./actions/sendMessage');
const updateMessage = require('./actions/updateMessage');
const onDisconnect = require('./actions/onDisconnect');

module.exports = (namespace) => {
    namespace.on('connection', (socket) => {
        openChat(socket, namespace);
        sendMessage(socket, namespace);
        updateMessage(socket, namespace);
        onDisconnect(socket, namespace);
    });
};
