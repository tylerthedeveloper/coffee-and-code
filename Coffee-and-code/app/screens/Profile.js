import React, { Component } from "react";
import {
    ScrollView,
    Text,
    Linking,
    View,
    Alert,
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image
} from "react-native";
// import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { Card, Button } from "react-native-elements";
import { Constants, Location, Permissions } from "expo";
import Repo from "../component/Repo";

const data = [];

export default class Profile extends Component<Props> {
    constructor(props) {
        super();
        this.state = {
            repoData: [
                {
                    id: "1",
                    title: "Coffee and Code",
                    language: "React-Native",
                    desc: "Tutoring service made easy"
                },
                {
                    id: "2",
                    title: "Restaurant Website",
                    language: "HTML/CSS/PHP",
                    desc: "Malibu Grill Website Development"
                },
                {
                    id: "3",
                    title: "Coffee and Code",
                    language: "React-Native",
                    desc: "Tutoring service made easy"
                }
            ]
        };
    }

    componentDidMount() {}
    /** This is asd */
    render() {
        const {} = this.props;
        console.log(this.props);
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require("../../assets/ironman.png")}
                />
                <Text style={styles.paragraph}> Name: Abhishek </Text>
                <Text style={styles.paragraph}> Bio: Stark Industries </Text>
                <Text style={styles.paragraph}> Skills: </Text>
                <ScrollView
                    horizontal={true}
                    style={{ width: 160, height: 80 }}
                >
                    <Text style={styles.skills}>C</Text>
                    <Text style={styles.skills}>C++</Text>
                    <Text style={styles.skills}>Python</Text>
                </ScrollView>
                <Text style={styles.paragraph}> Repos: </Text>

                <Repo repoData={this.state.repoData} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#ecf0f1",
        padding: 8
    },
    paragraph: {
        margin: 10,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center"
    },
    logo: {
        height: 128,
        width: 128
    },
    skills: {
        textAlign: "center",
        fontSize: 18,
        height: 25,
        width: 80,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: "#d6d7da"
    },
    textarea: {
        width: 200,
        height: 100,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: "#d6d7da"
    }
});
