import React, { Component } from "react";
import { AsyncStorage, StyleSheet, Text, View } from "react-native";
import ChatThread from "../component/ChatThread";
import { ChatService } from "../../services/ChatService";
import * as firebase from "firebase";

export default class ChatThreads extends Component<Props> {
    constructor(props) {
        super();
        console.ignoredYellowBox = ["Setting a timer"];
        const onSendMessageTo = props.navigation.getParam("onSendMessageTo");
        console.log("onSendMessageTo", onSendMessageTo);
        this.state = {
            git_username: "",
            onSendMessageTo: onSendMessageTo,
            chatThreads: [
                {
                    chatThreadID: 1,
                    username: "tito"
                },
                {
                    chatThreadID: 2,
                    username: "tita"
                }
            ],
            navigation: props.navigation
        };
        this.onSelect = this.onSelect.bind(this);
        this.firestore = firebase.firestore();
        this.chatThreadsCollection = this.firestore.collection("chat-threads");
    }

    // TODO: Export this from chat service
    getAllChatThreadsByUserID(git_username) {
        this.chatThreadsCollection
            .doc(git_username)
            .collection("chatThreads")
            // split here and this is the thenable
            .onSnapshot(snapshot => {
                const chatThreads = [];
                snapshot.docs.map(doc => chatThreads.push(doc.data()));
                const onSendMessageTo = this.state.onSendMessageTo;
                if (onSendMessageTo) {
                    const chatThread = chatThreads.find(
                        chatThread =>
                            chatThread.git_username === onSendMessageTo
                    );
                    this.props.navigation.push("Messages", {
                        id: chatThread.chatThreadID,
                        git_username: git_username,
                        title: onSendMessageTo
                    });
                } else {
                    this.setState({
                        chatThreads: chatThreads
                    });
                }
            });
    }

    // TODO: where oes this go??? ... chat service
    createChatThread(git_recipient) {
        const git_username = this.state.git_username;
        const chatRoomKey = this.firestore.collection("messages").doc().id;
        const firstObj = {
            chatThreadID: chatRoomKey,
            git_username: git_recipient
        };
        const secondObj = {
            chatThreadID: chatRoomKey,
            git_username: git_username
        };
        const batch = this.firestore.batch();
        batch.set(
            this.chatThreadsCollection
                .doc(git_username)
                .collection("chatThreads")
                .doc(chatRoomKey),
            firstObj
        );
        batch.set(
            this.chatThreadsCollection
                .doc(git_recipient)
                .collection("chatThreads")
                .doc(chatRoomKey),
            secondObj
        );
        batch.commit();
    }

    // TODO: general UTILS / service separate file
    async _loadInitialState() {
        try {
            const git_username = await AsyncStorage.getItem("git_username");
            if (git_username !== null) {
                console.log(git_username);
                this.setState({ git_username: git_username });
                this.getAllChatThreadsByUserID(git_username);
            }
        } catch (error) {
            // TODO:
            // Error retrieving data
            console.log(error);
        }
    }

    componentDidMount() {
        this._loadInitialState().done();
    }

    onSelect(chatThread) {
        const { git_username_recipient, chatThreadID } = chatThread;
        const git_username = this.state.git_username;
        this.props.navigation.push("Messages", {
            id: chatThreadID,
            git_username: git_username,
            title: git_username_recipient
        });
    }

    render() {
        // console.log(this.props);
        return (
            <View style={{ flex: 1 }}>
                {this.state.chatThreads.map(chatThread => {
                    return (
                        <ChatThread
                            chatInfo={chatThread}
                            key={chatThread.chatThreadID}
                            onSelect={this.onSelect}
                        />
                    );
                })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    button: {},
    buttonContainer: {}
});
