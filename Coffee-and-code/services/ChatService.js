import firebase from "firebase";

// import { ChatThread, ChatMessage } from 'app/models/chat';
// import { Observable } from 'rxjs';

export class ChatService {

    constructor() {
      // this.chatThreadsCollection = firestore.collection('chat-threads');
      this.firestore = firebase.firestore();
      this.chatThreadsCollection = this.firestore.collection('chat-threads')
    }
  
    async createNewChatThread(_chatThreadID) {
      const chatThreadID = _chatThreadID || this.firestore.createId();
      const chatThreadObj = {
        chatThreadID: chatThreadID,
        active: true,
        userTyping: false,
        adminTyping: false
      };
      return this.chatThreadsCollection
        .doc(chatThreadID)
        .set(chatThreadObj)
        .then(() => chatThreadObj);
    }
  
  
    getAllChatThreadsByUserID(userID) {
      return this.chatThreadsCollection
          .doc(userID)
          .collection('chatThreads')
          .valueChanges();
    }
  
    getMessagesForChatThread(activeThreadID) {
      return this.firestore
          .collection('chat-messages')
          .doc(activeThreadID)
          .collection('messages')
          .valueChanges();
    }
  
    getActiveChatThreads() {
      return this.firestore.collection('chat-threads',
          ref => ref.where('active', '==', true))
        .valueChanges();
    }
  
    updateChatThread(activeThreadID, data) {
      return this.chatThreadsCollection
        .doc(activeThreadID)
        .update(data);
    }
  
    getMessagesForChat(activeThreadID) {
      return this.firestore.collection('chat-threads')
        .doc(activeThreadID)
        .collection('messages', ref => ref.orderBy('sentAt'))
        .valueChanges();
    }
  
    sendMessage(messageObj) {
      console.log(messageObj);
      const messageID = this.firestore.createId();
      const { messageText, chatThreadID, sender } = messageObj;
      const chatThreadObj = {
        messageID: messageID,
        isRead: false,
        sentAt: Date.now(),
        messageText: messageText,
        chatThreadID: chatThreadID,
        sender: sender
      };
      return this.chatThreadsCollection
        .doc(chatThreadID)
        .collection('messages')
        .doc(messageID)
        .set(chatThreadObj);
    }  
  }