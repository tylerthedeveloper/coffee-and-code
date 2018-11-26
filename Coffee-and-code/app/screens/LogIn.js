import React, { Component } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as firebase from "firebase";
import getGithubTokenAsync from "../gitAuth/getGitHubToken";
import { AsyncStorage } from "react-native";
import { FontAwesome as Icon } from "@expo/vector-icons";

import { addNewUser } from "../services/user-service";

// TODO: MINOR
// import Constants from '../constants';
// get GithubStorageKey from cosntants
const GithubStorageKey = "@Expo:GithubToken";
export let username = "";

// TODO: Change
export default class Profile extends Component<Props> {
    async signInAsync() {
        try {
            let token = await AsyncStorage.getItem(GithubStorageKey);
            if (token) {
                return await AsyncStorage.getItem("git_username").then(
                    git_username => {
                        console.log("git_username", git_username);
                        return git_username;
                    }
                );
            }

            token = await getGithubTokenAsync();
            if (token) {
                // TODO: Arpit: do we need await?
                AsyncStorage.setItem(GithubStorageKey, token); // TODO: TTL? : MINOR
                const credential = firebase.auth.GithubAuthProvider.credential(
                    token
                );
                return firebase
                    .auth()
                    .signInAndRetrieveDataWithCredential(credential)
                    .then(user => {
                        const git_username = user.additionalUserInfo.username.toString();
                        // TODO:
                        console.log("Set username");
                        AsyncStorage.setItem("git_username", git_username);
                        return fetchGitData(git_username).then(res => {
                            const { profile, repos } = res;
                            console.log("Set Profile before");
                            AsyncStorage.setItem(
                                "profile",
                                JSON.stringify(profile)
                            );
                            console.log("Set Profile after");

                            // AsyncStorage.setItem("repos", repos);
                            return addNewUser(profile).then(res => {
                                console.log(res);
                                return git_username;
                            });
                            // TODO: add repos:
                        });
                    });
            } else {
                console.log("login error");
                return;
            }
        } catch ({ message }) {
            alert(message);
        }
    }

    signIn(navigation) {
        this.signInAsync()
            // TODO: createRootNavigator( true )
            .then(git_username => {
                console.log("sign in");
                console.log(git_username);
                navigation.navigate("SignedIn", {
                    git_username: git_username
                });
            });
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <Image
                    source={require("../../assets/giphy.gif")}
                    style={{ width: 200, height: 350, marginLeft: 100 }}
                />
                <Text
                    style={{
                        color: "white",
                        fontSize: 50,
                        marginLeft: 180,
                        fontWeight: "bold"
                    }}
                >
                    &
                </Text>
                <Text
                    style={{
                        color: "white",
                        fontSize: 50,
                        marginLeft: 140,
                        fontWeight: "bold"
                    }}
                >
                    Code
                </Text>
                <TouchableOpacity
                    style={{
                        width: 175,
                        height: 50,
                        marginLeft: 110,
                        marginTop: 0
                    }}
                >
                    <Icon.Button
                        name="github"
                        style={{ width: 180, height: 50 }}
                        color="black"
                        backgroundColor="white"
                        onPress={() => this.signIn(navigation)}
                    >
                        Sign In with Github
                    </Icon.Button>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    }
});

// TODO: Arpit
export function fetchGitData(username) {
    const urls = [
        `https://api.github.com/users/${username}/repos`,
        `https://api.github.com/users/${username}`
    ];
    return Promise.all(
        urls.map(url => fetch(url).then(res => res.json()))
    ).then(res => {
        const repos = res[0].map(repo => {
            // (repos : IRepo) , repos => repo as IRepo
            const {
                id,
                name,
                language,
                description,
                html_url,
                created_at,
                forks_count,
                stargazers_count,
                owner
            } = repo;
            const slimRepo = {
                repoID: id,
                user_name: owner.login,
                repo_name: name,
                language: language || "Not specified",
                description: description || "",
                repo_url: html_url,
                creation_date: created_at,
                forks_count: forks_count,
                stargazers_count: stargazers_count
            };

            return slimRepo;
        });

        const {
            id,
            login,
            avatar_url,
            followers,
            following,
            public_repos,
            bio,
            name
        } = res[1];
        const slimProfile = {
            user_id: id,
            git_username: login,
            image_url: avatar_url,
            followers: followers,
            following: following,
            //public_repos: public_repos,
            bio: bio || "",
            name: name || ""
        };
        console.log("Profile:", slimProfile);
        return {
            profile: slimProfile,
            repos: repos
        };
    });
}
