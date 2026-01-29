const mongoose = require("mongoose");
const { Schema } = mongoose;

const reactionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    emoji: String,
    created_at: { type: Date, default: Date.now }
}, { _id: false });

const conversationSchema = new Schema({
    chatId: { type: Schema.Types.ObjectId, ref: "Chat" },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    content: String,
    messageId: { type: Schema.Types.ObjectId, ref: "Conversation" },
    attachments: [String],
    reactions: [reactionSchema],
    seenBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    updated: { type: Boolean, required: true, default: false },
    created_at: { type: Date, default: Date.now },
}, { versionKey: false });

conversationSchema.index({ chatId: 1 });
conversationSchema.index({ chatId: 1, created_at: 1 });
conversationSchema.index({ chatId: 1, created_at: -1 });

module.exports = mongoose.model("Conversation", conversationSchema, "conversations");
