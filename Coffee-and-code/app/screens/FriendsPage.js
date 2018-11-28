import React, { Component } from "react";
import { ScrollView, View, StyleSheet, AsyncStorage, Text } from "react-native";
import FriendsCard from "../component/FriendsCard";
import FriendRequestCard from "../component/FriendRequestCard";
import {
    acceptFriendRequest,
    deleteFriendRequest,
    getFriendRequestsReceived
} from "../services/friend-requests-service";
import { getFriends } from "../services/friends-service";

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
        this._acceptFriendRequest = this._acceptFriendRequest.bind(this);
    }

    async _init() {
        if (this.state.current_user && this.state.git_username === "") {
            await AsyncStorage.getItem("profile")
                .then(profile => JSON.parse(profile))
                .then(profile => {
                    const git_username = profile.git_username;
                    this.setState({
                        current_user: git_username,
                        current_user_picture_url: profile.picture_url
                    });
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
        const friendsPromise = getFriends(git_username);
        const friendRequestsPromise = getFriendRequestsReceived(git_username);
        Promise.all([friendsPromise, friendRequestsPromise]).then(res => {
            const friends = res[0];
            const friendRequests = res[1];
            const friendCards = friendRequests.result.map(friend => {
                const splitStringArr = friend.split(/:(.+)/);
                return {
                    git_username: splitStringArr[0],
                    picture_url: splitStringArr[1]
                };
            });
            this.setState({
                friends: friends,
                friendRequests: friendCards
            });
        });
    }

    _acceptFriendRequest(friendRequest) {
        const {
            friend: { picture_url, git_username }
        } = friendRequest;
        const state = {
            current_user: this.state.current_user,
            current_user_picture_url: this.state.current_user_picture_url,
            user: {
                git_username,
                picture_url
            }
        };
        acceptFriendRequest(state).then(res => {
            console.log(res);
            this.props.navigation.navigate("Profile", { res });
        });
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.state.friendRequests.length > 0 && (
                        <Text>
                            {" "}
                            Friend Requests {
                                this.state.friendRequests.length
                            }{" "}
                        </Text>
                    )}
                    {this.state.friendRequests.map(friendRequest => (
                        <FriendRequestCard
                            friend={friendRequest}
                            key={friendRequest.git_username}
                            navigation={navigation}
                            accept={this._acceptFriendRequest}
                        />
                    ))}
                    {this.state.friends.length > 0 && (
                        <Text> My Friends {this.state.friends.length} </Text>
                    )}
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
