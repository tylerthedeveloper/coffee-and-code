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
        this.state = { friends: [] };
    }

    componentDidMount() {
        this.fetchDataFromUserbase();
    }

    componentWillMount() {}

    fetchDataFromUserbase() {
        fetch(
            `https://code-and-coffee2.azurewebsites.net/friend-requests/nishchayagupta/received`,
            {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                    // TODO: Credentials / accesstoken
                }
            }
        )
            .then(res => res.json())
            .then(resData => {
                const friendCards = resData.result.map(friend => {
                    const splitStringArr = friend.split(/:(.+)/);
                    return {
                        username: splitStringArr[0],
                        photoUrl: splitStringArr[1]
                    };
                });
                this.setState({ friends: friendCards });
            });
    }

    render() {
        const {} = this.props;
        console.log(this.props);
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.state.friends.map(friend => (
                        <FriendRequestCard friendCard={friend} />
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
