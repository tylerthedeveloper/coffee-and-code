import React, { Component } from "react";
import { ScrollView, View, StyleSheet, AsyncStorage } from "react-native";
import FriendsCard from "../component/FriendsCard";
import FriendRequestCard from "../component/FriendRequestCard";

export default class FriendsPage extends Component<Props> {
    constructor(props) {
        super(props);
        const current_user = props.navigation.getParam("current_user");
        const git_username = props.navigation.getParam("git_username") || "";
        console.log("current_user", current_user);
        // console.log(props);
        this.state = {
            git_username: git_username,
            current_user: current_user || "",
            friends: [],
            friendRequests: []
        };
    }

    async _init() {
        if (this.state.current_user && this.state.git_username === "") {
            await AsyncStorage.getItem("git_username").then(git_username => {
                this.setState({ git_username });
                this.fetchFriendsData(git_username);
            });
        } else {
            this.fetchFriendsData(this.state.git_username);
        }
    }

    componentDidMount() {
        this._init();
    }

    fetchFriendsData(git_username) {
        const friendBody = {
            data: {
                gitusername_1: {
                    currentOp: "=",
                    value: git_username,
                    nextOp: null
                }
            }
        };
        const friendsPromise = fetch(
            "https://code-and-coffee2.azurewebsites.net/friends/query",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(friendBody)
            }
        )
            .then(res => res.json())
            .then(res => res.rows);

        const friendRequestsPromise = fetch(
            `https://code-and-coffee2.azurewebsites.net/friend-requests/${git_username}/received`,
            {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                    // TODO: Credentials / accesstoken
                }
            }
        ).then(res => res.json());
        Promise.all([friendsPromise, friendRequestsPromise]).then(res => {
            const friends = res[0];
            const friendRequests = res[1];
            const friendCards = friendRequests.result.map(friend => {
                const splitStringArr = friend.split(/:(.+)/);
                return {
                    username: splitStringArr[0],
                    photoUrl: splitStringArr[1]
                };
            });
            this.setState({
                friends: friends,
                friendRequests: friendCards
            });
            // console.log(friends);
            // console.log(friendCards);
        });
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <ScrollView>
                    {/* TODO: ADD friend requests text */}
                    {/* ADD friend requests # */}
                    {this.state.friendRequests.map(friendRequest => (
                        <FriendRequestCard
                            friend={friendRequest}
                            key={friendRequest.username}
                            navigation={navigation}
                        />
                    ))}
                    {/* TODO: ADD friends text */}
                    {/* ADD friends # */}
                    {this.state.friends.map(friend => (
                        <FriendsCard
                            friend={friend}
                            key={friend.gitusername_2}
                            navigation={navigation}
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
