import React, { Component } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Card, Button } from "react-native-elements";
import * as firebase from "firebase";
import getGithubTokenAsync from "../gitAuth/getGitHubToken";
import { AsyncStorage } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import { Navigation } from "react-native-navigation";
import SignedIn from "../router/route";
import { FontAwesome as Icon} from '@expo/vector-icons';

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
                            fontWeight: "bold",
                        }}
                    >
                        Code
                    </Text>
                    <TouchableOpacity
                        style={{
                            width: 175,
                            height: 50,
                            marginLeft: 110,
                            marginTop: 100
                        }}
                    >
                        <Icon.Button
                            name="github"
                            style={{ width: 180, height: 50 }}
                            color="black"
                            backgroundColor="white"
                            onPress={() => this.signIn(navigation)}
                        >
                            Sign In with Github a
                        </Icon.Button>
                    </TouchableOpacity>
                </View>
            );
        }
    }
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "black",
        }
    });
    