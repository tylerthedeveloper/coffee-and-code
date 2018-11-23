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
        this.state = { friendRequest: [] };
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
                this.setState({ friendRequest: friendCards });
            });
    }

    render() {
        const {} = this.props;
        //console.log(this.props);
        console.log("State is:",this.state);
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.state.friendRequest.map(friendRequest => (
                        <FriendRequestsTab friends={friendRequest} />
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
