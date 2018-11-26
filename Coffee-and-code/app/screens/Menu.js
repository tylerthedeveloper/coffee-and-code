import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight
} from "react-native";
import { NavigationActions } from "react-navigation";

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
        // console.log('navigation', navigation.state);
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
                        source={require("../../assets/react.png")}
                        style={styles.profileImage}
                    />
                    {/* <Text onPress={() => navigation.navigate("Profile", { git_username: "tylerthedeveloper"})}>
                    Profile
                </Text> */}
                </TouchableHighlight>
                <Text
                    onPress={() => navigation.navigate("Home")}
                    style={styles.uglyDrawerItem}
                >
                    Map
                </Text>
                <Text
                    onPress={() => navigation.navigate("List")}
                    style={styles.uglyDrawerItem}
                >
                    List
                </Text>
                <Text
                    onPress={() => navigation.navigate("Chat")}
                    style={styles.uglyDrawerItem}
                >
                    Chat
                </Text>
                {/* ADD LINE DIVIDER HERE */}
                <Text onPress={this.logout} style={styles.uglyDrawerItem}>
                    Log Out
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f6f6f6",
        paddingTop: 40,
        paddingHorizontal: 20
    },
    //TODO: Make better buttons
    uglyDrawerItem: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#E73536",
        padding: 15,
        margin: 5,
        borderRadius: 2,
        borderColor: "#E73536",
        borderWidth: 1,
        textAlign: "center"
    },
    profileImage: {}
});
