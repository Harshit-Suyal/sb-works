const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Create or Get Chat
router.post('/', async (req, res) => {
  try {
    const { projectId, participants } = req.body;
    const chatId = `chat_${projectId}`;

    let chat = await Chat.findOne({ chatId });
    
    if (!chat) {
      chat = new Chat({
        chatId,
        projectId,
        participants
      });
      await chat.save();
    }

    res.json({ message: 'Chat created/retrieved successfully', chat });
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat', error: error.message });
  }
});

// Get Chat by ID
router.get('/:chatId', async (req, res) => {
  try {
    const chat = await Chat.findOne({ chatId: req.params.chatId })
      .populate('participants', 'username email profilePicture')
      .populate('projectId', 'title');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat', error: error.message });
  }
});

// Get Chats by User
router.get('/user/:userId', async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.params.userId })
      .populate('participants', 'username email profilePicture')
      .populate('projectId', 'title')
      .sort({ lastMessage: -1 });
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats', error: error.message });
  }
});

// Send Message
router.post('/:chatId/message', async (req, res) => {
  try {
    const { sender, content } = req.body;
    
    const chat = await Chat.findOneAndUpdate(
      { chatId: req.params.chatId },
      {
        $push: { messages: { sender, content } },
        lastMessage: new Date()
      },
      { new: true }
    ).populate('participants', 'username email');

    res.json({ message: 'Message sent successfully', chat });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// Mark Messages as Read
router.put('/:chatId/read', async (req, res) => {
  try {
    const { userId } = req.body;
    
    await Chat.updateOne(
      { chatId: req.params.chatId },
      { $set: { 'messages.$[elem].read': true } },
      { arrayFilters: [{ 'elem.sender': { $ne: userId }, 'elem.read': false }] }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking messages', error: error.message });
  }
});

module.exports = router;