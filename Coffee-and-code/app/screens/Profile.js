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

export default class Profile extends Component<Props> {
    constructor(props) {
        super(props);
        const current_user = props.navigation.getParam("current_user");
        const git_username = props.navigation.getParam("git_username") || "";
        const isFriendRequest =
            props.navigation.getParam("isFriendRequest") || false;
        const isCurrentFriend =
            props.navigation.getParam("isCurrentFriend") || false;
        console.log("current_user", current_user);
        this.state = {
            current_user: current_user || "",
            git_username: git_username,
            user: {},
            isFriendRequest: isFriendRequest,
            isCurrentFriend: isCurrentFriend
        };
    }

    async init() {
        await AsyncStorage.getItem("git_username").then(git_username =>
            this.setState({ current_user: git_username })
        );
        console.log(this.state);
        if (this.state.current_user && this.state.git_username === "") {
            await AsyncStorage.getItem("profile")
                .then(profile => JSON.parse(profile))
                .then(user => {
                    console.log("user1", user);
                    this.setState({ user });
                });
        } else {
            getUserByID(this.state.git_username)
                .then(users => users[0])
                .then(user => {
                    console.log("user2", user);
                    this.setState({ user });
                });
        }
    }

    componentDidMount() {
        this.init();
    }

    createButtonView() {
        if (
            this.state.isCurrentFriend &&
            this.state.current_user !== this.state.git_username
        ) {
            return (
                <View>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text>Send Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text>Delete Friend</Text>
                    </TouchableOpacity>
                </View>
            );
        } else if (this.state.isFriendRequest) {
            return (
                <View>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text>Accept Friend Request</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text>Delete Friend Request</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text>Logout</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    render() {
        const {
            current_latitude,
            current_location,
            current_longitude,
            git_username,
            name,
            picture_url,
            user_id
        } = this.state.user;
        // followers: followers,
        // following: following,`
        console.log(this.state);
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.header} />
                    <Image
                        style={styles.avatar}
                        source={{
                            uri: picture_url
                        }}
                    />
                    <View style={styles.body}>
                        <View style={styles.bodyContent}>
                            <Text style={styles.name}> {git_username} </Text>
                            <Text style={styles.name}> {name} </Text>
                            {/* <Text style={styles.name}> { bio } </Text> */}
                            <Text style={styles.info}>Bloomington, IN</Text>
                            <Text style={styles.description}>
                                Skills Set:React Native
                            </Text>
                            <View>{this.createButtonView()}</View>
                        </View>
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
