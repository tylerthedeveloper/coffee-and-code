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
import FriendRequestsTab from "../component/FriendRequestsTab";

const data = [];

export default class FriendRequests extends Component<Props> {
    constructor(props) {
        super();
        this.state = {
            friends_data: [
                {
                    key: "1",
                    id: "Nishchaya",
                    photo: "../assets/Nishchay.jpg",
                    time: "11:00"
                },
                {
                    key: "2",
                    id: "Arpit",
                    photo: "../assets/Arpit.png",
                    time: "11:30"
                },
                {
                    key: "3",
                    id: "Abhishek",
                    photo: "../assets/Abhishek.jpg",
                    time: "11:40"
                },
                {
                    key: "4",
                    id: "Tyler",
                    photo: "../assets/Tyler.png",
                    time: "11:50"
                }
            ]
        };
    }

    componentWillMount() {}

    render() {
        const {} = this.props;

        return (
            // <View style={styles.container}>
            <FriendRequestsTab friends={this.state.friends_data} />
            // </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    button: {},
    buttonContainer: {}
});
