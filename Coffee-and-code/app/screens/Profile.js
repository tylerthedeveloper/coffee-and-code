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
// TODO: import firebase

export default class Profile extends Component {
    constructor() {
        super();
        this.state = {
            git_username: ""
        };
    }

    componentDidMount() {
        AsyncStorage.getItem("git_username").then(git_username => {
            this.setState({ git_username });
            getUserByID(git_username).then(res => console.log(res));
        });
    }

    render() {
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
                            <Text style={styles.name}>Arpit Bhatnagar</Text>
                            <Text style={styles.info}>Mobile developer</Text>
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
