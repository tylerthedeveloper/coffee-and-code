import React from "react";
import { View } from "react-native";
import { Card, Button } from "react-native-elements";
import * as firebase from "firebase";
import getGithubTokenAsync from "../gitAuth/getGitHubToken";
import { AsyncStorage } from "react-native";

const GithubStorageKey = "@Expo:GithubToken";
console.log(module.exports);

async function signInAsync(token) {
    console.log("Entered in signInAsync");
    try {
        if (!token) {
            const token = await getGithubTokenAsync();
            if (token) {
                await AsyncStorage.setItem(GithubStorageKey, token);
                return signInAsync(token);
            } else {
                return;
            }
        }
        const credential = firebase.auth.GithubAuthProvider.credential(token);
        return firebase.auth().signInAndRetrieveDataWithCredential(credential);
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

const onSignIn = () =>
    new Promise((res, rej) => {
        // AsyncStorage.setItem(USER_KEY, "true");
        res("signedIn");
    });

function signIn(navigation) {
    signInAsync();
    onSignIn().then(() => navigation.navigate("SignedIn"));
}

export default ({ navigation }) => (
    <View style={{ paddingVertical: 20 }}>
        <Card>
            <Button
                buttonStyle={{ marginTop: 20 }}
                backgroundColor="#03A9F4"
                title="Login with GitHub"
                onPress={() => signIn(navigation)}
            />
        </Card>
    </View>
);
