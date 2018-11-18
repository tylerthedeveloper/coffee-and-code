// import { parse } from "react-docgen";
import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import ChatThread from "../component/ChatThread";
import { ChatService } from "../../services/ChatService";
import * as firebase from "firebase";

// const componentDocs = parse(Component);

export default class ChatThreads extends Component<Props> {
    constructor(props) {
        super();
        // console.log(props.navigation);
        this.state = {
            git_username: "",
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
    getAllChatThreadsByUserID(/** TODO: this.state.git_username */ userID) {
        this.chatThreadsCollection
            .doc(userID)
            .collection("chatThreads")
            .onSnapshot(snapshot => {
                const chatThreads = [];
                snapshot.docs.map(doc => chatThreads.push(doc.data()));
                this.setState({
                    chatThreads: chatThreads
                });
            });
    }

    createChatThread(
        /** TODO: this.state.git_username */ git_username,
        git_recipient
    ) {
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
        // TODO: Remove after more testing
        // batch.set(this.chatThreadsCollection
        //     .doc(git_username), { git_username: git_username });
        // batch.set(this.chatThreadsCollection
        //     .doc(git_recipient), { git_username: git_recipient });
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

    componentDidMount() {
        // TODO: get firebase auth username from local storage
        // const git_username = ....
        // this.setState({ git_username: git_username });
        this.getAllChatThreadsByUserID(/* git_username */ "akanai");
        setTimeout(() => this.createChatThread("akanai", "priya"), 3000);
    }

    onSelect(chatThreadID) {
        this.props.navigation.push("Messages", {
            id: chatThreadID
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
