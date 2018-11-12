import * as React from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView
} from "react-native";
import { Constants } from "expo";

// You can import from local files
import AssetExample from "./components/AssetExample";

// or any pure javascript modules available in npm
import { Card } from "react-native-paper";

export default class App extends React.Component {
    state = {
        profile_data: [
            {
                id: "Nishchaya",
                photo: "../assets/Nishchay.jpg",
                time: "10 Nov"
            },
            { id: "Arpit", photo: "../assets/Arpit.png", time: "10 Nov" },
            { id: "Abhishek", photo: "../assets/Abhishek.jpg", time: "11 Nov" },
            { id: "Tyler", photo: "../assets/Tyler.png", time: "10 Nov" }
        ]
    };

    render() {
        return (
            <React.Fragment
                style={{ backgroundColor: "white", height: 700, padding: 20 }}
            >
                <ScrollView style={{ marginTop: 50 }}>
                    <View style={styles.mainViewStyle}>
                        <View style={styles.imageViewSource}>
                            <Image
                                style={styles.image}
                                source={require("./assets/Nishchay.jpg")}
                            />
                        </View>
                        <View style={styles.textViewStyle}>
                            <Text
                                style={{
                                    color: "white",
                                    marginTop: 5,
                                    fontWeight: "bold"
                                }}
                            >
                                Name : {this.state.profile_data[0].id}
                            </Text>
                            <Text style={{ color: "white", marginTop: 5 }}>
                                Friend Since : {this.state.profile_data[0].time}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.button}>
                                <Text
                                    style={{
                                        color: "white",
                                        marginTop: 5,
                                        fontFamily: "Calibri"
                                    }}
                                >
                                    Remove
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.mainViewStyle}>
                        <View style={styles.imageViewSource}>
                            <Image
                                style={styles.image}
                                source={require("./assets/Arpit.jpg")}
                            />
                        </View>
                        <View style={styles.textViewStyle}>
                            <Text
                                style={{
                                    color: "white",
                                    marginTop: 5,
                                    fontWeight: "bold"
                                }}
                            >
                                Name : {this.state.profile_data[1].id}
                            </Text>
                            <Text style={{ color: "white", marginTop: 5 }}>
                                Friend Since : {this.state.profile_data[1].time}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.button}>
                                <Text
                                    style={{
                                        color: "white",
                                        marginTop: 5,
                                        fontFamily: "Calibri"
                                    }}
                                >
                                    Remove
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.mainViewStyle}>
                        <View style={styles.imageViewSource}>
                            <Image
                                style={styles.image}
                                source={require("./assets/Abhishekjpg.jpg")}
                            />
                        </View>
                        <View style={styles.textViewStyle}>
                            <Text
                                style={{
                                    color: "white",
                                    marginTop: 5,
                                    fontWeight: "bold"
                                }}
                            >
                                Name : {this.state.profile_data[2].id}
                            </Text>
                            <Text style={{ color: "white", marginTop: 5 }}>
                                Friend Since : {this.state.profile_data[2].time}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.button}>
                                <Text
                                    style={{
                                        color: "white",
                                        marginTop: 5,
                                        fontFamily: "Calibri"
                                    }}
                                >
                                    Remove
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.mainViewStyle}>
                        <View style={styles.imageViewSource}>
                            <Image
                                style={styles.image}
                                source={require("./assets/Tyler.jpg")}
                            />
                        </View>
                        <View style={styles.textViewStyle}>
                            <Text
                                style={{
                                    color: "white",
                                    marginTop: 5,
                                    fontWeight: "bold"
                                }}
                            >
                                Name : {this.state.profile_data[3].id}
                            </Text>
                            <Text style={{ color: "white", marginTop: 5 }}>
                                Friend Since : {this.state.profile_data[3].time}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.button}>
                                <Text
                                    style={{
                                        color: "white",
                                        marginTop: 5,
                                        fontFamily: "Calibri"
                                    }}
                                >
                                    Remove
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: 70,
        height: 70,
        borderRadius: 35
    },
    textViewStyle: {
        flex: 2,
        flexDirection: "column",
        width: 200,
        height: 50,
        justifyContent: "space-between",
        marginTop: 10
    },
    imageViewSource: {
        width: 90,
        height: 100,
        shadowColor: "white",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1
    },
    mainViewStyle: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "black",
        borderRadius: 30,
        height: 100,
        marginTop: 20,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1
    },
    button: {
        alignItems: "center",
        backgroundColor: "red",
        padding: 10,
        width: 100,
        height: 50,
        marginTop: 10,
        borderRadius: 20,
        shadowColor: "gray",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1
    }
});
