import React, { Component } from "react";
import { ScrollView, View, StyleSheet, AsyncStorage } from "react-native";
import FriendRequestsTab from "../component/FriendRequestsTab";

export default class FriendRequests extends Component<Props> {
    constructor() {
        super();
        this.state = {
            git_username: "",
            friendRequests: []
        };
    }

    async _init() {
        await AsyncStorage.getItem("git_username").then(git_username => {
            // let _username = git_username || "nishchaya";
            this.setState({ git_username });
            this.fetchDataFromUserbase(git_username);
        });
    }

    componentDidMount() {
        this._init();
    }

    fetchDataFromUserbase(git_username) {
        fetch(
            `https://code-and-coffee2.azurewebsites.net/friend-requests/${git_username}/received`,
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
                this.setState({
                    friendRequests: friendCards
                });
            });
    }

    render() {
        const {} = this.props;
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.state.friendRequests.map(friendRequest => (
                        <FriendRequestsTab
                            friends={friendRequest}
                            key={friendRequest}
                        />
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
