// import { parse } from "react-docgen";
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import ChatThread from "../component/ChatThread";

// const componentDocs = parse(Component);

export default class ChatThreads extends Component<Props> {
    constructor(props) {
        super();
        // console.log(props.navigation);
        this.state = {
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
    }

    // componentWillMount() {

    // }

    onSelect(chatThreadID) {
        // console.log(chatThreadID);
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
