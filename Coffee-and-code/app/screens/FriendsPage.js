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
import FriendsTab from "../component/FriendsTab";
import * as constants from "../component/constants";

const data = [];

export default class FriendsPage extends Component<Props> {
    constructor(props) {
        super();
        this.state = { friends: [] };
    }

    componentWillMount() {
        this.fetchDataFromUserbase();
    }

    componentDidMount() {}

    fetchDataFromUserbase() {
        const body = {
            data: {
                gitusername_1: {
                    currentOp: "=",
                    value: "kanikeabhishek",
                    nextOp: null
                }
            }
        };
        fetch("https://code-and-coffee2.azurewebsites.net/friends/query", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(resData => this.setState({ friends: resData.rows }));
    }

    render() {
        const {} = this.props;
        console.log("friends : ", this.state.friends);
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.state.friends.map(friend => (
                        <FriendsTab addedFriends = {friend} />
                    ))}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    button: {},
    buttonContainer: {}
});
