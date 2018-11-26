import * as React from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    AsyncStorage
} from "react-native";

export default class FriendRequestCard extends React.Component {
    render() {
        const { navigation, friend } = this.props;
        const { username } = friend;
        return (
            <View style={styles.mainViewStyle}>
                <View style={styles.imageViewSource}>
                    <TouchableOpacity
                        onPress={() =>
                            this.friendRequestsNavigation.navigate(
                                "PendingFriendProfile"
                            )
                        }
                    >
                        <Image
                            style={styles.image}
                            source={require("../../assets/ironman.png")}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.textViewStyle}>
                    <Text style={{ color: "white", marginTop: 5 }}>
                        Name : {username}
                    </Text>
                </View>
                <View>
                    <TouchableOpacity style={styles.button}>
                        <Text style={{ color: "white", marginTop: 5 }}>
                            Accept
                        </Text>
                    </TouchableOpacity>
                </View>
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
        backgroundColor: "green",
        padding: 10,
        width: 100,
        height: 50,
        marginTop: 10,
        borderRadius: 20
    }
});
