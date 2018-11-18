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
        return (
            <TouchableHighlight
                onPress={() => this.props.onSelect(chatThreadID)}
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
