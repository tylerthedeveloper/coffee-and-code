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
import firebase from "firebase";
import { createChatThread } from "../services/chat-service";
import { logout, sendMessage } from "../services/profile-utils";
import { acceptFriendRequest } from "../services/friend-requests-service";
import {
    updateUserSkills,
    getUserByID,
    updateUserPreferences
} from "../services/user-service";

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
        // console.log("current_user", current_user);
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
        let profile = await AsyncStorage.getItem("profile")
            .then(profile => JSON.parse(profile))
            .then(profile => {
                this.setState({
                    current_user: profile.git_username,
                    current_user_picture_url: profile.picture_url
                });
                return profile;
            });
        profile.skills = JSON.parse(JSON.stringify(profile.skills));
        // console.log("profile", profile);
        if (this.state.current_user && this.state.git_username === "") {
            // await AsyncStorage.getItem("profile")
            //     .then(profile => JSON.parse(profile))
            //     .then(user => {
            //         // console.log("user1", user);
            // this.setState({ user });
            //     });
            this.setState({ user: profile });
        } else {
            getUserByID(this.state.git_username)
                .then(users => users[0])
                .then(user => {
                    // console.log("user2", user);
                    this.setState({ user });
                });
        }
    }

    refreshProfile() {
        getUserByID(this.state.current_user)
            .then(users => users[0])
            .then(user => {
                console.log("updated user", user);
                this.setState({ user });
                AsyncStorage.setItem("profile", JSON.stringify(user));
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

    addSkills(skillsObj) {
        // TODO: Parse object
    }

    // launchUpdateSkills(skillsObj) {
    //     let _skillsObj = {};
    //     Object.keys(skillsObj).map(key => {
    //         const arr = skillsObj[key];
    //         _skillsObj[key] = {};
    //         arr.map(skill => _skillsObj[key][skill] = true);
    //     })
    //     console.log(_skillsObj);
    //     // const newSkills = {
    //     //     C: true,
    //     //     Java: true,
    //     //     Python: true
    //     // };
    //     updateUserPreferences
    //     // const newSkillsObj = {
    //     //     git_username: this.state.current_user,
    //     //     skills: newSkills
    //     // };
    //     // Promise.resolve(newSkillsObj)
    //     //     // .then(newSkills => ({
    //     //     //     git_username: this.state.git_username,
    //     //     //     skills: newSkills
    //     //     // }))
    //     //     .then(newSkillsObj => updateUserSkills(newSkillsObj))
    //     //     .then(res => this.refreshProfile());
    // }

    launchUpdateSkills(skillsObj) {
        let _skillsObj = {};
        Object.keys(skillsObj).map(key => {
            const arr = skillsObj[key];
            _skillsObj[key] = {};
            arr.map(skill => (_skillsObj[key][skill] = true));
        });

        console.log("_skillsObj", _skillsObj);
        const newSkillsObj = {
            git_username: this.state.current_user,
            preferences: _skillsObj
        };
        console.log("newSkillsObj", newSkillsObj);
        updateUserPreferences(newSkillsObj).then(res => this.refreshProfile());
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
                        onPress={() =>
                            this.props.navigation.push("List", {
                                passProps: {
                                    callback: data =>
                                        this.launchUpdateSkills(data)
                                }
                            })
                        }
                    >
                        <Text>Update Skills</Text>
                    </TouchableOpacity>
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
            blog,
            company,
            current_location,
            email,
            latitude,
            longitude,
            git_username,
            name,
            picture_url,
            skills,
            need_help,
            will_help,
            will_tutor,
            user_id
        } = this.state.user;
        console.log("skills", skills);
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
                            <Text style={styles.info}> {bio} </Text>
                            <Text style={styles.info}>Bloomington, IN</Text>
                            <Text style={styles.description}>
                                Skills:
                                {skills &&
                                    Object.keys(skills)
                                        .map(
                                            skill =>
                                                skills[skill] ? skill : ""
                                        )
                                        .join(",")}
                            </Text>
                            <Text style={styles.description}>
                                Need Help with:
                                {need_help &&
                                    Object.keys(need_help)
                                        .map(
                                            help =>
                                                need_help[help] ? help : ""
                                        )
                                        .join(",")}
                            </Text>
                            <Text style={styles.description}>
                                Will Help With:
                                {will_help &&
                                    Object.keys(will_help)
                                        .map(
                                            help =>
                                                will_help[help] ? help : ""
                                        )
                                        .join(",")}
                            </Text>
                            <Text style={styles.description}>
                                Will Tutor in:
                                {will_tutor &&
                                    Object.keys(will_tutor)
                                        .map(
                                            tutor =>
                                                will_tutor[tutor] ? tutor : ""
                                        )
                                        .join(",")}
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
