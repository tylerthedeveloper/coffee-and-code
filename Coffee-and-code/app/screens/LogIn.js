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
        console.log("Entered in signInAsync");
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
                const user= firebase
                    .auth()
                    .signInAndRetrieveDataWithCredential(credential).then(user =>{
                        console.log("Arpit");
                        const username = user.additionalUserInfo.username.toString(); 
                        const photoURL = user.user.photoURL.toString(); 
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

    function fetchGitData(username){
       //const langs = [];
       var params =[ "language", "name", "description"];
       var array = [];
       var userRepoDetails = [];
       const urls =[
        `https://api.github.com/users/${username}/repos`,
        `https://api.github.com/users/${username}`,
        
       ]
       Promise.all(urls.map(url =>
        fetch(url)
           .then(res => res.json())
       ))
        .then(res => {
                const repos = res[0].map(repo => { // (repos : IRepo) , repos => repo as IRepo
                    const { id, name, language, description, html_url } = repo;
                    const slimRepo = {
                        id : id,
                        name: name,
                        language: language,
                        description: description,
                        html_url: html_url
                    }
                    // console.log(repo);
                    console.log(slimRepo);
                    return slimRepo;
                });
            
                const { id,login, avatar_url, followers, following, public_repos, bio, name } = res[1];
                const slimProfile = {
                    id,
                    login,
                    avatar_url,
                    followers,
                    following,
                    public_repos,
                    bio,
                    name
                }
                console.log(slimProfile);
            });
    }
