import * as firebase from "firebase";

export const createChatThread = (git_username, git_recipient) => {
    const firestore = firebase.firestore();
    const chatThreadsCollection = firestore.collection("chat-threads");
    const chatRoomKey = firestore.collection("messages").doc().id;
    const firstObj = {
        chatThreadID: chatRoomKey,
        git_username: git_recipient
    };
    const secondObj = {
        chatThreadID: chatRoomKey,
        git_username: git_username
    };
    const batch = firestore.batch();
    batch.set(
        chatThreadsCollection
            .doc(git_username)
            .collection("chatThreads")
            .doc(chatRoomKey),
        firstObj
    );
    batch.set(
        chatThreadsCollection
            .doc(git_recipient)
            .collection("chatThreads")
            .doc(chatRoomKey),
        secondObj
    );
    return batch.commit();
};

export const getAllChatThreadsByUserID = (git_username, onSendMessageTo) => {
    const firestore = firebase.firestore();
    const chatThreadsCollection = firestore.collection("chat-threads");
    return chatThreadsCollection
        .doc(git_username)
        .collection("chatThreads")
        .get()
        .then(snapshot => {
            const chatThreads = [];
            snapshot.docs.map(doc => chatThreads.push(doc.data()));
            // TODO:?
            if (onSendMessageTo) {
                console.log("onSendMessageTo");
                const chatThread = chatThreads.find(
                    chatThread => chatThread.git_username === onSendMessageTo
                );
                return {
                    id: chatThread.chatThreadID,
                    git_username: git_username,
                    title: onSendMessageTo
                };
            } else {
                return chatThreads;
            }
        });
};
