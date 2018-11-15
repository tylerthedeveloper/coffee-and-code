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

// const componentDocs = parse(Component);

const data = [];

export default class ChatMessages extends Component<Props> {
    constructor(props) {
        super();
        this.state = {
            chatThreads: []
        };
    }

    componentWillMount() {
        this.setState({
            chatThreads: [
                {
                    chatThreadId: 1,
                    username: "tito"
                },
                {
                    chatThreadId: 2,
                    username: "tita"
                }
            ]
            // messages: [
            //     {
            //         _id: 1,
            //         text: 'Hello developer',
            //         createdAt: new Date(),
            //         user: {
            //             _id: 2,
            //             name: 'React Native',
            //             avatar: 'https://placeimg.com/140/140/any',
            //         },
            //     },
            //     {
            //         _id: 3,
            //         text: 'Hello developer',
            //         createdAt: new Date(),
            //         user: {
            //             _id: 4,
            //             name: 'React Native',
            //             avatar: 'https://placeimg.com/140/140/any',
            //         },
            //     },
            // ],
        });
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }));
    }

    render() {
        const {} = this.props;
        console.log(this.state.messages);
        return (
            <View style={{ flex: 1 }}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1
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
