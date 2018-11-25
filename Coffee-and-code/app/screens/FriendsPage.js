import React, { Component } from "react";
import { ScrollView, View, StyleSheet, AsyncStorage } from "react-native";
import FriendsTab from "../component/FriendsTab";

export default class FriendsPage extends Component<Props> {
    constructor() {
        super();
        this.state = {
            friends: []
        };
    }

    async _init() {
        await AsyncStorage.getItem("git_username").then(git_username => {
            // let _username = git_username || "nishchaya";
            console.log("friends mounting " + git_username);
            this.setState({ git_username });
            this.fetchDataFromUserbase(git_username);
        });
    }

    componentDidMount() {
        console.log("friends: fetchDataFromUserbase");
        this._init();
    }

    fetchDataFromUserbase(username) {
        console.log("friends: fetchDataFromUserbase");

        // TODO: get username
        const body = {
            data: {
                gitusername_1: {
                    currentOp: "=",
                    value: username, // "kanikeabhishek",
                    nextOp: null
                }
            }
        };
        fetch("https://code-and-coffee2.azurewebsites.net/friends/query", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(resData => {
                console.log("resData");
                console.log(resData);
                this.setState({
                    friends: resData.rows
                });
            });
    }

    render() {
        const {} = this.props;
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.state.friends.map(friend => (
                        <FriendsTab
                            addedFriends={friend}
                            key={friend.gitusername_2}
                        />
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
