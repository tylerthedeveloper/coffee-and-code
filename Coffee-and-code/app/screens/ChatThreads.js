import React, { Component } from "react";
import { AsyncStorage, StyleSheet, Text, View } from "react-native";
import ChatThread from "../component/ChatThread";
import { getAllChatThreadsByUserID } from "../services/chat-service";
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

    async _loadInitialState() {
        try {
            const git_username = await AsyncStorage.getItem("git_username");
            if (git_username !== null) {
                console.log(git_username);
                this.setState({ git_username: git_username });
                getAllChatThreadsByUserID(
                    git_username,
                    this.state.onSendMessageTo
                ).then(chatThreadResponse => {
                    if (chatThreadResponse.length >= 0) {
                        this.setState({
                            chatThreads: chatThreadResponse
                        });
                    } else {
                        navigation.push("Messages", chatThreadResponse);
                    }
                });
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
