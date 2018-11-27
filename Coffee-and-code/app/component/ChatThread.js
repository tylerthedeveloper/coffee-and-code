import React, { Component } from "react";
import { Text, TouchableHighlight } from "react-native";
import { Card } from "react-native-elements";

export default class ChatThread extends Component<Props> {
    constructor() {
        super();
        this.state = {};
    }

    componentWillMount() {}

    render() {
        const { git_username, chatThreadID } = this.props.chatInfo;
        const git_username_recipient = git_username;
        return (
            <TouchableHighlight
                onPress={() =>
                    this.props.onSelect({
                        git_username_recipient,
                        chatThreadID
                    })
                }
            >
                <Card>
                    <Text style={{ marginBottom: 10 }}>
                        USERNAME: {git_username}
                    </Text>
                </Card>
            </TouchableHighlight>
        );
    }
}
