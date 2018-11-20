// import { parse } from "react-docgen";
import React, { Component } from "react";
import {
    ScrollView,
    Text,
    Linking,
    View,
    Alert,
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";
import * as firebase from "firebase";

// const componentDocs = parse(Component);

const data = [];

export default class ChatMessages extends Component<Props> {
    constructor(props) {
        super();
        console.log(props.navigation);
        this.state = {
            chatThreadID: props.navigation.getParam("id"),
            messages: [],
            git_username: props.navigation.getParam("git_username")
        };
        this.firestore = firebase.firestore();
        this.chatMessagesCollection = this.firestore.collection(
            "chat-messages"
        );
        console.log(this.state.chatThreadID);
    }

    componentDidMount() {
        this.chatMessagesCollection
            .doc(this.state.chatThreadID)
            .collection("chatMessages")
            .onSnapshot(snapshot => {
                const chatMessages = [];
                snapshot.docs.map(doc => chatMessages.push(doc.data()));
                this.setState({
                    messages: chatMessages
                });
            });
    }

    onSend(messages = []) {
        // TODO: link to firebase
        const message = messages[0];
        console.log(message);
        // const chatMessageRef = this.chatMessagesCollection
        //     .doc(this.state.chatThreadID)
        //     .collection('chatMessages');
        // const chatMessageID = chatMessageRef.doc().id;
        // message.chatMessageID = chatMessageID;
        // chatMessageRef.doc(chatMessageID)
        //     .set(message)
        //     .then(() => {
        //         // TODO: set ...
        //         this.setState(previousState => ({
        //             messages: GiftedChat.append(previousState.messages, message)
        //         }));
        //     })
    }

    render() {
        const { messages, git_username } = this.state;
        // console.log(this.props.navigation.getParam("id"));
        // console.log(this.state.messages);
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

const styles = StyleSheet.create({
    container: {},
    button: {},
    buttonContainer: {}
});
