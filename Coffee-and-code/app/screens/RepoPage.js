import React, { Component } from "react";
import { ScrollView, View, StyleSheet, AsyncStorage, Text } from "react-native";
import RepoCard from "../component/RepoCard";
import {
    acceptFriendRequest,
    deleteFriendRequest,
    getFriendRequestsReceived
} from "../services/friend-requests-service";
import { getFriends } from "../services/friends-service";

export default class RepoPage extends Component<Props> {
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
        const repoData = AsyncStorage.getItem("repos")
            .then(repos => JSON.parse(repos))
            .then(repoData => this.setState({ repoData: repoData }));
        // console.log(this.state.repoData);
    }

    componentWillMount() {
        this._init();
    }

    render() {
        console.log("repoState", this.state.repoData);
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.RepoText}> Repositories </Text>
                <ScrollView>
                    {this.state.repoData.map(repo => (
                        <RepoCard key={repo.repoID} repo={repo} />
                    ))}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: 20
    },
    RepoText: {
        fontWeight: "bold",
        fontSize: 40,
        textAlign: "center",
        color: "black"
    }
});
