import React from "react";
import { View } from "react-native";
import { Card, Button } from "react-native-elements";
import firebase from "firebase";
import getGithubTokenAsync from "./getGithubToken";

const GithubStorageKey = "@Expo:GithubToken";
var config = {
    apiKey: "AIzaSyAm7s-C4OwFlOnynJA5VuPHEwg2XEkRSEk",
    authDomain: "coffee-and-code-app.firebaseapp.com",
    databaseURL: "https://coffee-and-code-app.firebaseio.com",
    projectId: "coffee-and-code-app",
    storageBucket: "coffee-and-code-app.appspot.com",
    messagingSenderId: "312294253706"
};

function initializeFirebase() {
    // Prevent reinitializing the app in snack.
    if (!firebase.apps.length) {
        return firebase.initializeApp(firebaseConfig);
    }
}

async function signInAsync(token) {
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

async function signOutAsync() {
    try {
        await AsyncStorage.removeItem(GithubStorageKey);
        await firebase.auth().signOut();
    } catch ({ message }) {
        alert("Error: " + message);
    }
}

async function attemptToRestoreAuthAsync() {
    let token = await AsyncStorage.getItem(GithubStorageKey);
    if (token) {
        console.log("Sign in with token", token);
        return signInAsync(token);
    }
}

const onSignIn = () =>
    new Promise((res, rej) => {
        // AsyncStorage.setItem(USER_KEY, "true");
        res("signedIn");
    });

export default ({ navigation }) => (
    <View style={{ paddingVertical: 20 }}>
        <Card>
            <Button
                buttonStyle={{ marginTop: 20 }}
                backgroundColor="#03A9F4"
                title="Login with GitHub"
                onPress={() => {
                    onSignIn().then(() => signInAsync());
                }}
            />
        </Card>
    </View>
);
