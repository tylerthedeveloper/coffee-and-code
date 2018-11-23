import React, { Component } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as firebase from "firebase";
import getGithubTokenAsync from "../gitAuth/getGitHubToken";
import { AsyncStorage } from "react-native";
import { FontAwesome as Icon } from "@expo/vector-icons";

// TODO: MINOR
// import Constants from '../constants';
// get GithubStorageKey from cosntants
const GithubStorageKey = "@Expo:GithubToken";

export default class Profile extends Component<Props> {
    async signInAsync() {
        try {
            // TODO:  double await execution logic : MINOR
            const token =
                (await AsyncStorage.getItem(GithubStorageKey)) ||
                (await getGithubTokenAsync());
            if (token) {
                await AsyncStorage.setItem(GithubStorageKey, token); // TODO: TTL? : MINOR
                const credential = firebase.auth.GithubAuthProvider.credential(
                    token
                );
                const user = firebase
                    .auth()
                    .signInAndRetrieveDataWithCredential(credential)
                    .then(user => {
                        console.log("Arpit");
                        const username = user.additionalUserInfo.username.toString();
                        //const phone = user.user.phoneNumber.toString();

                        fetchGitData(username);
                    });
                return user;
            } else {
                return;
            }
        } catch ({ message }) {
            alert(message);
        }
    }

    signIn(navigation) {
        this.signInAsync()
            // TODO: createRootNavigator( true )
            .then(() => navigation.navigate("SignedIn"));
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

function fetchGitData(username) {
    const urls = [
        `https://api.github.com/users/${username}/repos`,
        `https://api.github.com/users/${username}`
    ];
    Promise.all(urls.map(url => fetch(url).then(res => res.json()))).then(
        res => {
            console.log(res[1]);
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
                user_name: login,
                image_url: avatar_url,
                followers: followers,
                following: following,
                public_repos: public_repos,
                bio: bio,
                full_name: name
            };
            console.log(slimProfile);
        }
    );
}
