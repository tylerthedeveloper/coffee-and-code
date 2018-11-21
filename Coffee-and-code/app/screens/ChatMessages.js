import React, { Component } from "react";
import { View, Platform } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";
import * as firebase from "firebase";

export default class ChatMessages extends Component<Props> {
    constructor(props) {
        super();
        this.state = {
            chatThreadID: props.navigation.getParam("id"),
            messages: [],
            git_username: props.navigation.getParam("git_username")
        };
        this.firestore = firebase.firestore();
        this.chatMessagesCollection = this.firestore.collection(
            "chat-messages"
        );
    }

    // TODO: move into chat service
    getChatMessages() {
        const unsubscribe = this.chatMessagesCollection
            .doc(this.state.chatThreadID)
            .collection("chatMessages")
            .onSnapshot(snapshot => {
                const chatMessages = [];
                snapshot.docChanges.forEach(function(change) {
                    console.log(change.type);
                    if (change.type === "added") {
                        console.log("New city: ", change.doc.data());
                        chatMessages.unshift(change.doc.data());
                    }
                });
                this.setState(previousState => ({
                    messages: GiftedChat.append(
                        previousState.messages,
                        chatMessages
                    )
                }));
            });
        return unsubscribe;
    }

    componentDidMount() {
        this.getChatMessages();
    }

    componentWillUnmount() {
        const unsubscribe = this.getChatMessages();
        unsubscribe();
    }

    onSend(messages = []) {
        // TODO: link to firebase
        const message = messages[0];
        const chatMessageRef = this.chatMessagesCollection
            .doc(this.state.chatThreadID)
            .collection("chatMessages");
        const chatMessageID = Date.now();
        message.chatMessageID = Date.now();
        chatMessageRef.doc(chatMessageID.toString()).set(message);
    }

    render() {
        const { messages, git_username } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <GiftedChat
                    messages={messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: git_username
                    }}
                />
                {Platform.OS === "android" ? <KeyboardSpacer /> : null}
            </View>
        );
    }
}
