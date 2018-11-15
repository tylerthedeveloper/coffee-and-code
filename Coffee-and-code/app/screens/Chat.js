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
import { Card, Button } from "react-native-elements";
import { Constants, Location, Permissions } from "expo";
// import { GiftedChat } from 'react-native-gifted-chat'

// const componentDocs = parse(Component);

const data = [];

export default class Chat extends Component<Props> {
    constructor(props) {
        super();
        this.state = {};
    }

    componentWillMount() {}

    render() {
        const {} = this.props;
        console.log(this.props);
        return <View style={styles.container} />;
        // return (
        //     <GiftedChat
        //         messages={[]}
        //     />
        // )
    }
}

const styles = StyleSheet.create({
    container: {},
    button: {},
    buttonContainer: {}
});
