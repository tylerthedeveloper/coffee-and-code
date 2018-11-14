import * as React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Constants } from "expo";
import { FontAwesome as Icon } from "@expo/vector-icons";

// You can import from local files
import AssetExample from "./components/AssetExample";

// or any pure javascript modules available in npm
import { Card } from "react-native-paper";

export default class App extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Image
                    source={require("./assets/giphy.gif")}
                    style={{ width: 200, height: 350, marginLeft: 70 }}
                />
                <Text
                    style={{
                        color: "white",
                        fontSize: 50,
                        marginLeft: 150,
                        fontWeight: "bold",
                        fontFamily: "Courier"
                    }}
                >
                    &
                </Text>
                <Text
                    style={{
                        color: "white",
                        fontSize: 50,
                        marginLeft: 110,
                        fontWeight: "bold",
                        fontFamily: "Courier"
                    }}
                >
                    Code
                </Text>
                <TouchableOpacity
                    style={{
                        width: 175,
                        height: 50,
                        marginLeft: 80,
                        marginTop: 100
                    }}
                >
                    <Icon.Button
                        name="github"
                        style={{ width: 180, height: 50 }}
                        color="black"
                        backgroundColor="white"
                        onPress={this.props.onPress}
                    >
                        Sign In with Github
                    </Icon.Button>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "black",
        padding: 8
    }
});
