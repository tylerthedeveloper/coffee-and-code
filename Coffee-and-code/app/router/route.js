import React from "react";
import { Text, AsyncStorage, View } from "react-native";
import {
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
  createMaterialTopTabNavigator,
  createAppContainer
} from "react-navigation";
import { Icon } from "react-native-elements";
import LogIn from "../screens/LogIn";
import Home from "../screens/Home";
import List from "../screens/List";
import Menu from "../screens/Menu";
import Profile from "../screens/Profile";
import FriendsPage from "../screens/FriendsPage";
import RepoPage from "../screens/RepoPage";
import ChatThreads from "../screens/ChatThreads";
import ChatMessages from "../screens/ChatMessages";

// TODO: Separate files

const SignedOut = createStackNavigator({
  LogIn: {
    screen: LogIn,
    navigationOptions: {
      header: null
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
  },
  Repos: {
    screen: RepoPage,
    navigationOptions: {
      title: "Repositories"
    }
  }
});

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
  },
  {
    headerMode: "float",
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: "#4285F4" },
      title: navigation.routeName || "Coffee-and-Code",
      headerTintColor: "white",
      gesturesEnabled: false,
      headerLeft: drawerButton(navigation),
      git_username: navigation.getParam("git_username") || ""
      // current_user: current_user || ""
    })
  }
);

const DrawerStack = createDrawerNavigator(
  { ScreenStackNavigator },
  {
    gesturesEnabled: false,
    contentComponent: Menu,
    navigationOptions: ({ navigation }) => {
      const git_username = navigation.getParam("git_username");
      const current_user = navigation.getParam("current_user");
      // console.log("navigation1", git_username);
      return {
        git_username: git_username || "Me",
        current_user: current_user || ""
      };
    }
  }
);

const drawerButton = navigation => (
  <View>
    <Icon
      name="menu"
      color="white"
      onPress={() => {
        navigation.toggleDrawer();
      }}
    />
  </View>
);

export const DrawerNavigation = createStackNavigator(
  {
    DrawerStack: {
      screen: DrawerStack,
      navigationOptions: ({ navigation }) => {
        const git_username = navigation.getParam("git_username");
        const current_user = navigation.getParam("current_user");
        // console.log("navigation1", git_username);
        return {
          git_username: git_username || "Me",
          current_user: current_user || ""
        };
      }
    }
  },
  {
    headerMode: "none",
    navigationOptions: ({ navigation }) => {
      const git_username = navigation.getParam("git_username");
      const current_user = navigation.getParam("current_user");
      // console.log("navigation1", git_username);
      return {
        git_username: git_username || "Me",
        current_user: current_user || ""
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
        const current_user = navigation.getParam("current_user");
        // console.log("navigation1", git_username);
        return {
          git_username: git_username || "Me",
          current_user: current_user || ""
        };
      }
    }
  },
  {
    navigationOptions: ({ navigation }) => {
      const git_username = navigation.getParam("git_username");
      const current_user = navigation.getParam("current_user");
      // console.log("navigation1", git_username);
      return {
        git_username: git_username || "Me",
        current_user: current_user || ""
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
          const current_user = navigation.getParam("current_user");
          // console.log("navigation1", git_username);
          return {
            git_username: git_username || "Me",
            current_user: current_user || ""
          };
        }
      }
    },
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut",
      // initialRouteName: async () => {
      //     return await AsyncStorage.getItem("git_username")
      //         .then(res => {
      //             if (signedIn && res) return "SignedIn";
      //             return "SignedOut";
      //         });
      // },
      headerMode: "none",
      navigationOptions: ({ navigation }) => {
        const git_username = navigation.getParam("git_username");
        const current_user = navigation.getParam("current_user");
        // console.log("navigation1", git_username);
        return {
          git_username: git_username || "Me",
          current_user: current_user || ""
        };
      }
    }
  );
