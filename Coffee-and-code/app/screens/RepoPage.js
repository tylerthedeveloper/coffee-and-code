import React, { Component } from "react";
import { ScrollView, View, StyleSheet, AsyncStorage } from "react-native";
import RepoCard from "../component/RepoCard";
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
            repoData: []
        };
    }

    async _init() {
        const repoData = AsyncStorage.getItem("repos").then(repos =>
            JSON.parse(repos)
        );
        this.setState({ repoData: repoData });
    }

    componentDidMount() {
        this._init();
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.text}> Repositories </Text>
                <ScrollView>
                    {this.state.repoData.map(repo => (
                        <RepoCard repo={repo} />
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
