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


export default class App extends React.Component {
    state = {
        profile_data: [
            { id: "Chirag", photo: "../assets/Nishchay.jpg", time: "10 Nov" },
            { id: "Murtaza", photo: "../assets/Arpit.png", time: "11 Nov" },
            { id: "Chetan", photo: "../assets/Abhishek.jpg", time: "10 Nov" },
            { id: "Shantanu", photo: "../assets/Tyler.png", time: "10 Nov" }
        ]
    };

    render() {
        return (
            <View
                style={{ backgroundColor: "white", height: 700, padding: 20 }}
            >
                <ScrollView style={{ marginTop: 50 }}>
                    <View style={styles.mainViewStyle}>
                        <View style={styles.imageViewSource}>
                            <Image
                                style={styles.image}
                                source={require("../../assets/Chirag.jpg")}
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
                                Received : {this.state.profile_data[0].time}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.button}>
                                <Text
                                    style={{
                                        color: "white",
                                        marginTop: 5,
                                    
                                    }}
                                >
                                    Accept
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.mainViewStyle}>
                        <View style={styles.imageViewSource}>
                            <Image
                                style={styles.image}
                                source={require("../../assets/Murtazajpg.jpg")}
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
                                Received : {this.state.profile_data[1].time}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.button}>
                                <Text
                                    style={{
                                        color: "white",
                                        marginTop: 5,
                                        
                                    }}
                                >
                                    Accept
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.mainViewStyle}>
                        <View style={styles.imageViewSource}>
                            <Image
                                style={styles.image}
                                source={require("../../assets/Chetan.jpg")}
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
                                Received : {this.state.profile_data[2].time}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.button}>
                                <Text
                                    style={{
                                        color: "white",
                                        marginTop: 5,
                                        
                                    }}
                                >
                                    Accept
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.mainViewStyle}>
                        <View style={styles.imageViewSource}>
                            <Image
                                style={styles.image}
                                source={require("../../assets/shantanu.jpg")}
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
                                Received : {this.state.profile_data[3].time}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.button}>
                                <Text
                                    style={{
                                        color: "white",
                                        marginTop: 5,
                                        
                                    }}
                                >
                                    Accept
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
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
        backgroundColor: "green",
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