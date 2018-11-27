import * as firebase from "firebase";

export function createChatThread(git_username, git_recipient) {
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
}
