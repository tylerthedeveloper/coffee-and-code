import * as React from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView
} from "react-native";

export default class FriendsTab extends React.Component {
    render() {
        console.log(this.props.friends);

        return (
            <View style={{ height: 700 }}>
                <ScrollView>
                    {this.props.friends.map(friend => (
                        <View key={friend.key} style={styles.mainViewStyle}>
                            <View style={styles.imageViewSource}>
                                <Image
                                    style={styles.image}
                                    source={require("../../assets/ironman.png")}
                                />
                            </View>
                            <View style={styles.textViewStyle}>
                                <Text style={{ color: "white", marginTop: 5 }}>
                                    Name : {friend.gitusername_2}
                                </Text>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.button}>
                                    <Text
                                        style={{ color: "white", marginTop: 5 }}
                                    >
                                        Remove
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: 70,
        height: 70
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
        height: 100
    },
    mainViewStyle: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "black",
        borderRadius: 30,
        height: 100,
        marginTop: 20,
        padding: 12
    },
    button: {
        alignItems: "center",
        backgroundColor: "red",
        padding: 10,
        width: 100,
        height: 50,
        marginTop: 10,
        borderRadius: 20
    }
});
