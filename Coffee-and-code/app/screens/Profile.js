import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    AsyncStorage
} from "react-native";

//const apiurl = 'https://code-and-coffee2.azurewebsites.net';
import { getUserByID } from "../services/user-service";
import { username } from "../screens/LogIn";
import { fetchGitData } from "./LogIn";
import firebase from "firebase";
// TODO: import firebase

export default class Profile extends Component {
    constructor() {
        super();
        this.state = {
            git_username: ""
        };
    }
    async init() {
        await AsyncStorage.getItem("git_username").then(git_username => {
            this.setState({ git_username });
            getUserByID(git_username).then(res => console.log(res));
        });
    }
    componentDidMount() {
        this.init();
    }

    render() {
        const pendingFriend = null;

        const viewFriend = null;
        const existingFriend = null;
        const acceptReq = (
            <TouchableOpacity style={styles.buttonContainer}>
                <Text>Accept Friend Request </Text>
            </TouchableOpacity>
        );
        const deleteReq = (
            <TouchableOpacity style={styles.buttonContainer}>
                <Text>Delete Friend Request </Text>
            </TouchableOpacity>
        );
        const sendMsg = (
            <TouchableOpacity style={styles.buttonContainer}>
                <Text>Send Message </Text>
            </TouchableOpacity>
        );
        const addFriend = (
            <TouchableOpacity style={styles.buttonContainer}>
                <Text>Add Friend </Text>
            </TouchableOpacity>
        );
        const deleteFriend = (
            <TouchableOpacity style={styles.buttonContainer}>
                <Text>Remove Friend </Text>
            </TouchableOpacity>
        );
        const editProfile = (
            <TouchableOpacity style={styles.buttonContainer}>
                <Text>Edit Profile </Text>
            </TouchableOpacity>
        );
        const logout = (
            <TouchableOpacity style={styles.buttonContainer}>
                <Text> Logout </Text>
            </TouchableOpacity>
        );

        let friendAcceptReq;
        let friendDeleteReq;
        let sendMsgReq;
        let addFriendReq;
        let deleteFriendReq;
        let editProfileReq;
        let logoutReq;
        if (pendingFriend != null) {
            friendAcceptReq = acceptReq;
            friendDeleteReq = deleteReq;
        } else if (viewFriend != null) {
            sendMsgReq = sendMsg;
            addFriendReq = addFriend;
        } else if (existingFriend != null) {
            deleteFriendReq = deleteFriend;
        } else {
            editProfileReq = editProfile;
            logoutReq = logout;
        }
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.header} />
                    <Image
                        style={styles.avatar}
                        source={{
                            uri:
                                "https://avatars3.githubusercontent.com/u/1481628?v=4"
                        }}
                    />
                    <View style={styles.body}>
                        <View style={styles.bodyContent}>
                            <Text style={styles.name}>Arpit Bhatnagar A</Text>
                            <Text style={styles.info}>Bloomington, IN</Text>
                            <Text style={styles.description}>
                                Skills Set:React Native
                            </Text>
                            <TouchableOpacity
                                style={styles.buttonContainer}
                                onPress={this.getAllUsers}
                            >
                                <Text>Edit Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonContainer}>
                                <Text>Logout</Text>
                            </TouchableOpacity>
                        </View>
                        <View>{friendAcceptReq}</View>
                        <View>{friendDeleteReq}</View>
                        <View>{sendMsgReq}</View>
                        <View>{addFriendReq}</View>
                        <View>{deleteFriendReq}</View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#000000",
        height: 150
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        alignSelf: "center",
        position: "absolute",
        marginTop: 70
    },
    name: {
        fontSize: 22,
        color: "#FFFFFF",
        fontWeight: "600"
    },
    body: {
        marginTop: 30
    },
    bodyContent: {
        flex: 1,
        alignItems: "center",
        padding: 30
    },
    name: {
        fontSize: 28,
        color: "#696969",
        fontWeight: "600"
    },
    info: {
        fontSize: 16,
        color: "#00BFFF",
        marginTop: 10
    },
    description: {
        fontSize: 16,
        color: "#696969",
        marginTop: 10,
        textAlign: "center"
    },
    buttonContainer: {
        marginTop: 10,
        height: 45,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        width: 200,
        borderRadius: 30,
        backgroundColor: "#00BFFF"
    }
});
