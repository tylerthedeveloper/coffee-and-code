import React, { Component } from "react";
import { View, Image, Text } from "react-native";
import { Card, Button } from "react-native-elements";
import * as firebase from "firebase";
import getGithubTokenAsync from "../gitAuth/getGitHubToken";
import { AsyncStorage } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import { Navigation } from "react-native-navigation";
import SignedIn from "../router/route";

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
                return firebase
                    .auth()
                    .signInAndRetrieveDataWithCredential(credential);
            } else {
                return;
            }
        } catch ({ message }) {
            alert(message);
        }
    }

    // async function signOutAsync() {
    //     try {
    //         await AsyncStorage.removeItem(GithubStorageKey);
    //         await firebase.auth().signOut();
    //     } catch ({ message }) {
    //         alert("Error: " + message);
    //     }
    // }

    // async function attemptToRestoreAuthAsync() {
    //     let token = await AsyncStorage.getItem(GithubStorageKey);
    //     if (token) {
    //         console.log("Sign in with token", token);
    //         return signInAsync(token);
    //     }
    // }

    signIn(navigation) {
        this.signInAsync()
            // TODO: createRootNavigator( true )
            .then(() => navigation.navigate("SignedIn"));
        // .then(() => {
        // const actionToDispatch = StackActions.reset({
        //       index: 0,
        //       // key: 'SignedIn',  // black magic
        //       actions: [
        //         NavigationActions.navigate({ routeName: 'SignedIn' })
        //         // navigation.navigate("SignedIn")
        //       ],
        //       key: 'SignedIn'
        //     });
        //     navigation.dispatch(actionToDispatch)

        // Navigation.setRoot({
        //   component: {
        //     name: 'SignedIn'
        //   }
        // })
        // })
        //     // .catch()
    }

    render() {
        const { navigation } = this.props;
        return (
            <View
                style={{
                    paddingVertical: 20,
                    backgroundColor: "#FFFFFF",
                    height: 700
                }}
            >
                <Image
                    source={require("../images/logo.png")}
                    style={{
                        width: 250,
                        height: 250,
                        alignItems: "center",
                        backgroundColor: "transparent",
                        marginLeft: 80
                    }}
                />
                <Button
                    buttonStyle={{ marginTop: 200 }}
                    backgroundColor="#03A9F4"
                    title="Login with GitHub"
                    onPress={() => this.signIn(navigation)}
                />
            </View>
        );
    }
}

// TODO:
// const styles = StyleSheet.create({
