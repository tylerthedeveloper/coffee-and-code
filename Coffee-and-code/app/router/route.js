import React from "react";
import { Platform, StatusBar, Text } from "react-native";
import {
    StackNavigator,
    TabNavigator,
    SwitchNavigator,
    createStackNavigator,
    createBottomTabNavigator,
    createSwitchNavigator,
    createDrawerNavigator,
    createTabNavigator,
    createMaterialTopTabNavigator
} from "react-navigation";

import { FontAwesome } from "react-native-vector-icons";

import LogIn from "../screens/LogIn";
import Home from "../screens/Home";
import List from "../screens/List";
import Chat from "../screens/Chat";
import Menu from "../screens/Menu";
import Profile from "../screens/Profile";
import FriendRequests from "../screens/FriendRequests";
import FriendsPage from "../screens/FriendsPage";

export const SignedOut = createStackNavigator({
    LogIn: {
        screen: LogIn,
        navigationOptions: {
            title: "Log In"
        }
    }
});

const ProfileTabNavigator = createMaterialTopTabNavigator({
    Profile: {
        screen: Profile,
        navigationOptions: {
            title: "Profile"
        }
    },
    Pending_Friend_Requests: {
        screen: FriendRequests,
        navigationOptions: {
            title: "Pending Friend Requests"
        }
    },
    Friends: {
        screen: FriendsPage,
        navigationOptions: {
            title: "Friends"
        }
    }
});

/** This is asd */
const ScreenStackNavigator = createStackNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: {
                title: "Home"
            }
        },
        List: {
            screen: List,
            navigationOptions: {
                title: "List"
            }
        },
        Chat: {
            screen: Chat,
            navigationOptions: {
                title: "Chat"
            }
        },
        Profile: {
            screen: ProfileTabNavigator,
            navigationOptions: {
                title: "Me"
            }
        }
    },
    {
        headerMode: "float",
        navigationOptions: ({ navigation }) => ({
            headerStyle: { backgroundColor: "#4C3E54" },
            title: navigation.routeName || "Coffee-and-Code",
            headerTintColor: "white",
            gesturesEnabled: false,
            headerLeft: drawerButton(navigation)
        })
    }
);

const DrawerStack = createDrawerNavigator(
    { ScreenStackNavigator },
    {
        gesturesEnabled: false,
        contentComponent: Menu
    }
);

const drawerButton = navigation => (
    <Text
        style={{ padding: 5, color: "white" }}
        onPress={() => {
            navigation.toggleDrawer();
        }}
    >
        {/* TODO: Change to hamburger font awesome */}
        Menu
    </Text>
);

export const DrawerNavigation = createStackNavigator(
    {
        DrawerStack: { screen: DrawerStack }
    },
    {
        headerMode: "none"
    }
);

export const SignedIn = createStackNavigator({
    DrawerStack: { screen: DrawerNavigation }
});

export const createRootNavigator = (signedIn = false) =>
    createSwitchNavigator(
        {
            SignedIn: {
                screen: DrawerNavigation
            },
            SignedOut: {
                screen: SignedOut
            }
        },
        {
            initialRouteName: signedIn ? "SignedIn" : "SignedOut",
            headerMode: "none"
        }
    );
