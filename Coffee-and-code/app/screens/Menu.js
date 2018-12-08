import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight
} from "react-native";
import { NavigationActions } from "react-navigation";
import { logout } from "../services/profile-utils";
import { TextButton, RaisedTextButton } from "react-native-material-buttons";
import Ripple from "react-native-material-ripple";
import { Icon } from "react-native-elements";

export default class Menu extends React.Component {
    // TODO: RESET STACK
    // TODO: Clear state?
    // TODO: ??? upload chat to DB from Redis

    logout = () => {
        // This will reset back to loginStack
        // https://github.com/react-community/react-navigation/issues/1127
        // const actionToDispatch = NavigationActions.reset({
        //   index: 0,
        //   key: null,  // black magic
        //   actions: [NavigationActions.navigate({ routeName: 'loginStack' })]
        // })
        // this.props.navigation.dispatch(actionToDispatch)
        // TODO: Call stack navigator and reset stack to signedOut
    };

    render() {
        const { navigation } = this.props;
        console.log(
            "navigation",
            this.props.navigation.getParam("git_username")
        );
        // TODO: STYLE AND Name each screen
        return (
            <View style={styles.container}>
                <TouchableHighlight
                    onPress={() =>
                        navigation.navigate("Profile", { current_user: "true" })
                    }
                >
                    <Image
                        // source={{ uri: "https://facebook.github.io/react-native/docs/assets/favicon.png" }}
                        source={require("../../assets/coffee_new.png")}
                        style={styles.profileImage}
                    />
                    {/* <Text onPress={() => navigation.navigate("Profile", { git_username: "tylerthedeveloper"})}>
                    Profile
                </Text> */}
                </TouchableHighlight>

                <View>
                    <Text
                        onPress={() => navigation.navigate("Profile")}
                        style={styles.uglyDrawerItem}
                    >
                        Profile
                    </Text>
                    <View style={styles.icon}>
                        <Icon name="face" color="#00aced" />
                    </View>
                </View>

                <View>
                    <Text
                        title="Home"
                        onPress={() => navigation.navigate("Home")}
                        style={styles.uglyDrawerItem}
                    >
                        Home
                    </Text>
                    <View style={styles.icon}>
                        <Icon name="home" color="#00aced" />
                    </View>
                </View>

                <View>
                    <Text
                        onPress={() => navigation.navigate("List")}
                        style={styles.uglyDrawerItem}
                    >
                        Preference
                    </Text>
                    <View style={styles.icon}>
                        <Icon name="list" color="#00aced" />
                    </View>
                </View>
                <View>
                    <Text
                        onPress={() => navigation.navigate("Chat")}
                        style={styles.uglyDrawerItem}
                    >
                        Chat
                    </Text>
                    <View style={styles.icon}>
                        <Icon name="chat" color="#00aced" />
                    </View>
                </View>
                <View>
                    {/* ADD LINE DIVIDER HERE */}
                    <Text
                        onPress={() => logout()}
                        style={styles.uglyDrawerItem}
                    >
                        Log Out
                    </Text>
                    <View style={styles.icon}>
                        <Icon name="subdirectory-arrow-right" color="#00aced" />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        paddingTop: 40,
        paddingHorizontal: 20
    },
    //TODO: Make better buttons
    uglyDrawerItem: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        padding: 10,
        margin: 10,
        marginTop: 30,
        textAlign: "left",
        flexDirection: "row"
    },
    icon: {
        flexDirection: "row",
        marginTop: 48,
        position: "absolute",
        left: 198
    },
    // icon_list: {
    //     flexDirection: "row",
    //     marginTop: 48,
    //     position: "absolute",
    //     left: 198
    // },
    profileImage: {
        borderRadius: 100,
        borderWidth: 4,
        borderColor: "white",

        left: 60
    }
});
