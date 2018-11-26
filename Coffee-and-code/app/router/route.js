import React from "react";
import { Text } from "react-native";
import {
    createStackNavigator,
    createSwitchNavigator,
    createDrawerNavigator,
    createMaterialTopTabNavigator,
    Tabnav
} from "react-navigation";

import LogIn from "../screens/LogIn";
import Home from "../screens/Home";
import List from "../screens/List";
import Menu from "../screens/Menu";
import Profile from "../screens/Profile";
import FriendsPage from "../screens/FriendsPage";
// import FriendRequests from "../screens/FriendRequests";
import ChatThreads from "../screens/ChatThreads";
import ChatMessages from "../screens/ChatMessages";
import PendingFriendProfile from "../screens/PendingFriendProfile";
import ExistingFriendProfile from "../screens/ExistingFriendProfile";

// TODO: Separate files

const SignedOut = createStackNavigator({
    LogIn: {
        screen: LogIn,
        navigationOptions: {
            title: "Log In"
        }
    }
});

const FriendStackNavigator = createStackNavigator({
    Friends: {
        screen: FriendsPage
    }
});

const ProfileTabNavigator = createMaterialTopTabNavigator({
    Profile: {
        screen: Profile,
        navigationOptions: {
            title: "Profile"
        }
    },
    Friends: {
        screen: FriendsPage,
        navigationOptions: {
            title: "Friends"
        }
    }
    // Pending_Friend_Requests: {
    //     screen: FriendRequests,
    //     navigationOptions: {
    //         title: "Pending Friend Requests"
    //     }
    // }
});

//TODO: Correct the navigation for different profile page
// const FriendProfileStackNavigator = createStackNavigator({
//     PendingFriendProfile: {
//         screen: PendingFriendProfile,
//         navigationOptions: {
//             title: "PendingFriendProfile"
//         }
//     },
//     ExistingFriendProfile: {
//         screen: ExistingFriendProfile,
//         navigationOptions: {
//             title: "ExistingFriendProfile"
//         }
//     }
// });

const ChatStackNavigator = createStackNavigator({
    Chat: {
        screen: ChatThreads,
        navigationOptions: {
            title: "Chats"
        }
    },
    Messages: {
        screen: ChatMessages,
        navigationOptions: ({ navigation }) => ({
            // headerStyle: { backgroundColor: "#4C3E54" },
            // set height
            title: `${navigation.state.params.title}`
        })
    }
});

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
            screen: ChatStackNavigator,
            navigationOptions: {
                title: "Chat"
            }
        },
        Profile: {
            screen: ProfileTabNavigator,
            navigationOptions: ({ navigation }) => {
                const git_username = navigation.getParam("git_username");
                const current_user = navigation.getParam("current_user");
                return {
                    title: git_username || "Me",
                    current_user: current_user || ""
                };
            }
        }
        // Pending_Friend_Profile: {
        //     screen: FriendProfileStackNavigator,
        //     navigationOptions: {
        //         title: "PendingFriendProfile"
        //     }
        // }
    },
    {
        headerMode: "float",
        navigationOptions: ({ navigation }) => ({
            headerStyle: { backgroundColor: "#4C3E54" },
            title: navigation.routeName || "Coffee-and-Code",
            headerTintColor: "white",
            gesturesEnabled: false,
            headerLeft: drawerButton(navigation)
            // git_username: git_username || "",
            // current_user: current_user || ""
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
        DrawerStack: {
            screen: DrawerStack,
            navigationOptions: ({ navigation }) => {
                // console.log(navigation.getParam("git_username"));
                const git_username = navigation.getParam("git_username");
                // console.log("navigation4", git_username);
                return {
                    git_username: git_username || "Me"
                };
            }
        }
    },
    {
        headerMode: "none",
        navigationOptions: ({ navigation }) => {
            // console.log(navigation.getParam("git_username"));
            const git_username = navigation.getParam("git_username");
            // console.log("navigation4", git_username);
            return {
                git_username: git_username || "Me"
            };
        }
    }
);

export const SignedIn = createStackNavigator(
    {
        DrawerStack: {
            screen: DrawerNavigation,
            navigationOptions: ({ navigation }) => {
                const git_username = navigation.getParam("git_username");
                // console.log("navigation3", git_username);
                return {
                    git_username: git_username || "Me"
                };
            }
        }
    },
    {
        navigationOptions: ({ navigation }) => {
            const git_username = navigation.getParam("git_username");
            // console.log("navigation3", git_username);
            return {
                git_username: git_username || "Me"
            };
        }
    }
);

export const createRootNavigator = (signedIn = false) =>
    createSwitchNavigator(
        {
            SignedOut: {
                screen: SignedOut
            },
            SignedIn: {
                screen: DrawerNavigation,
                navigationOptions: ({ navigation }) => {
                    const git_username = navigation.getParam("git_username");
                    // console.log("navigation2", git_username);
                    return {
                        git_username: git_username || "Me"
                    };
                }
            }
        },
        {
            initialRouteName: signedIn ? "SignedIn" : "SignedOut",
            headerMode: "none",
            navigationOptions: ({ navigation }) => {
                const git_username = navigation.getParam("git_username");
                // console.log("navigation1", git_username);
                return {
                    git_username: git_username || "Me"
                };
            }
        }
    );
