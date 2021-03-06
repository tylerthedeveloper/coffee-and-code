import React, { Component } from "react";
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Dimensions
} from "react-native";
import * as firebase from "firebase";
import getGithubTokenAsync from "../gitAuth/getGitHubToken";
import { AsyncStorage } from "react-native";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { addNewUser } from "../services/user-service";
import { addRepos } from "../services/git-service"; // TODO: fetchGitData

// TODO: MINOR
// import Constants from '../constants';
// get GithubStorageKey from cosntants
const GithubStorageKey = "@Expo:GithubToken";

export default class Login extends Component<Props> {
    // TODO: Login service
    async signInAsync() {
        try {
            let token = await AsyncStorage.getItem(GithubStorageKey);
            if (token) {
                console.log("token", token);
                return await AsyncStorage.getItem("git_username").then(
                    git_username => {
                        console.log("git_username", git_username);
                        return git_username;
                    }
                );
            }
            token = await getGithubTokenAsync();
            if (token) {
                console.log("second token", token);
                AsyncStorage.setItem(GithubStorageKey, token);
                const credential = firebase.auth.GithubAuthProvider.credential(
                    token
                );
                const git_username_fromStorage = await AsyncStorage.getItem(
                    "git_username"
                );
                if (git_username_fromStorage) {
                    console.log(
                        "git_username_fromStorage",
                        git_username_fromStorage
                    );
                    return git_username_fromStorage;
                }
                // • • • • • FIRST TIME LOGIN
                console.log("FIRST TIME LOGIN");
                return firebase
                    .auth()
                    .signInAndRetrieveDataWithCredential(credential)
                    .then(user => {
                        const git_username = user.additionalUserInfo.username.toString();
                        console.log("user", git_username);
                        AsyncStorage.setItem("git_username", git_username);
                        // TODO: from service
                        return fetchGitData(git_username).then(res => {
                            // console.log("fetchGitData");
                            const { profile, repos } = res;
                            AsyncStorage.setItem(
                                "current_user_picture_url",
                                profile.picture_url
                            );
                            // console.log("picture_url");
                            AsyncStorage.setItem(
                                "profile",
                                JSON.stringify(profile)
                            );
                            // console.log("profile");
                            AsyncStorage.setItem(
                                "repos",
                                JSON.stringify(repos)
                            );
                            console.log("repos");
                            return Promise.all([
                                addNewUser(profile),
                                addRepos(repos)
                            ])
                                .then(res => {
                                    console.log("res");
                                    return git_username;
                                })
                                .catch(err => console.log(err));
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
        this.signInAsync().then(git_username => {
            console.log("sign in", git_username);
            navigation.navigate("SignedIn", {
                git_username: git_username
            });
        });
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require("../../assets/coffee.jpg")}
                    style={styles.backgroundImage}
                >
                    <Image
                        source={require("../../assets/banner.png")}
                        style={styles.banner}
                    />
                    <TouchableOpacity
                        style={styles.gitButton}
                        onPress={() => this.signIn(navigation)}
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
                </ImageBackground>
            </View>
        );
    }
}
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null
    },
    gitButton: {
        flex: 1,
        width: 175,
        height: 50,
        marginLeft: width * 0.28,
        marginTop: height * 0.35,
        borderRadius: 50
    },
    banner: {
        flex: 1,
        width: null,
        height: null,
        marginTop: 130,
        resizeMode: "contain"
    }
});

// TODO: move to login service
export function fetchGitData(username) {
    const urls = [
        `https://api.github.com/users/${username}`,
        `https://api.github.com/users/${username}/repos`
    ];
    const promises = urls.map(url => fetch(url).then(res => res.json()));
    return Promise.all(promises).then(res => {
        const {
            id,
            login,
            avatar_url,
            followers,
            following,
            bio,
            name,
            company,
            blog,
            email
        } = res[0];
        const slimProfile = {
            bio: bio || "",
            blog: blog || "",
            company: company || "",
            current_location: null,
            email: email || "",
            git_username: login,
            latitude: 39.1653,
            longitude: 86.5264,
            name: name || "",
            picture_url: avatar_url,
            skills: {
                C: true,
                // "C++": true,
                Java: false,
                Python: true
            },
            user_id: id,
            will_help: {},
            need_help: {},
            will_tutor: {},
            looking_for: {}
        };
        console.log("Profile:", slimProfile);
        const repos = res[1].map(repo => {
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
        console.log("repos parsed");
        return {
            profile: slimProfile,
            repos: repos
        };
    });
}
