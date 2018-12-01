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

import { getUserByID } from "../services/user-service";
// import { fetchGitData } from "./LogIn";
import firebase from "firebase";
import { createChatThread } from "../services/chat-service";
import { logout, sendMessage } from "../services/profile-utils";
import { acceptFriendRequest } from "../services/friend-requests-service";

// const apiurl = "https://code-and-coffee2.azurewebsites.net";
const status = "";

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
            current_user_picture_url: "",
            git_username: git_username,
            user: {},
            isFriendRequest: isFriendRequest,
            isCurrentFriend: isCurrentFriend
        };
    }

    async init() {
        await AsyncStorage.getItem("profile")
            .then(profile => JSON.parse(profile))
            .then(profile =>
                this.setState({
                    current_user: profile.git_username,
                    current_user_picture_url: profile.picture_url
                })
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
        AsyncStorage.getItem("CurrItem")
            .then(currentItem => JSON.parse(currentItem))
            .then(currData => {
                status = currData.toString();
            });
    }

    // deleteFriendRequest() {
    //     const {
    //         current_user,
    //         current_user_picture_url,
    //         user: { git_username, picture_url }
    //     } = this.state;
    //     const body = {
    //         data: {
    //             fromUser: {
    //                 git_username_from: git_username,
    //                 // picture_url
    //                 picture_url_from:
    //                     "https://avatars0.githubusercontent.com/u/1957707?s=400&v=4"
    //             },
    //             toUser: {
    //                 git_username_to: current_user,
    //                 picture_url_to: current_user_picture_url
    //             }
    //         }
    //     };
    //     console.log(body);
    //     // TODO: post to acceptFriendRequest
    // }

    deleteFriend() {
        // TODO: navigate to your profile and make delete friend
    }

    editProfile() {
        // TODO: wtf
    }

    createButtonView() {
        if (
            this.state.isCurrentFriend &&
            this.state.current_user !== this.state.git_username
        ) {
            return (
                <View>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={() =>
                            sendMessage(
                                this.state.user.git_username,
                                this.props.navigation
                            )
                        }
                    >
                        <Text>Send Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={() => this.deleteFriend()}
                    >
                        <Text>Delete Friend</Text>
                    </TouchableOpacity>
                </View>
            );
        } else if (this.state.isFriendRequest) {
            return (
                <View>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={() =>
                            acceptFriendRequest(this.state).then(
                                this.setState({ isCurrentFriend: true })
                            )
                        }
                    >
                        <Text>Accept Friend Request</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={() => this.deleteFriendRequest()}
                    >
                        <Text>Delete Friend Request</Text>
                    </TouchableOpacity>
                </View>
            );
        } else if (
            !this.state.isCurrentFriend &&
            !this.state.isFriendRequest &&
            this.state.git_username
        ) {
            // TODO: Test this
            return (
                <View>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={() => sendFriendRequest()}
                    >
                        <Text>Send Friend Request</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={() => this.editProfile()}
                    >
                        <Text>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={() => logout(this.props.navigation)}
                    >
                        <Text>Logout</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    render() {
        const {
            bio,
            current_latitude,
            current_location,
            current_longitude,
            git_username,
            name,
            picture_url,
            user_id
        } = this.state.user;
        // TODO:
        // followers: followers,
        // following: following,`

        console.log("Status var:", this.status);
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
                            <Text style={styles.name}> {bio} </Text>
                            <Text style={styles.info}>Bloomington, IN</Text>
                            <Text style={styles.info}>
                                Need Help : {status}
                            </Text>
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
    },
    bio: {}
});
