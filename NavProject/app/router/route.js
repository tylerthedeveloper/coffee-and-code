import React from "react";
import { Platform, StatusBar, Text } from "react-native";
import {
    StackNavigator,
    TabNavigator,
    SwitchNavigator,
    createStackNavigator,
    createBottomTabNavigator,
    createSwitchNavigator,
    createDrawerNavigator
} from "react-navigation";
import { FontAwesome } from "react-native-vector-icons";

import LogIn from "../screens/LogIn";
import Home from "../screens/Home";
import Menu from "../screens/Menu";

export const SignedOut = createStackNavigator({
    LogIn: {
        screen: LogIn,
        navigationOptions: {
            title: "Log In"
            // headerStyle
        }
    }
});

// drawer stack
// const DrawerStack = DrawerNavigator({
const DrawerStack = createDrawerNavigator(
    {
        screen1: { screen: Home }
        // screen2: { screen: Screen2 },
        // screen3: { screen3een: Screen3 },
    },
    {
        gesturesEnabled: false,
        contentComponent: Menu
    }
);

const drawerButton = navigation => (
    <Text
        style={{ padding: 5, color: "white" }}
        onPress={() => {
            console.log("open drawer");
            console.log(navigation.state);
            navigation.toggleDrawer();
        }}
    >
        Menu
    </Text>
);

export const DrawerNavigation = createStackNavigator(
    {
        DrawerStack: { screen: DrawerStack }
    },
    {
        headerMode: "float",
        navigationOptions: ({ navigation }) => ({
            headerStyle: { backgroundColor: "#4C3E54" },
            title: "Welcome!!!",
            headerTintColor: "white",
            gesturesEnabled: false,
            headerLeft: drawerButton(navigation)
        })
    }
);

export const SignedIn = createStackNavigator(
    {
        DrawerStack: { screen: DrawerNavigation }
        // Home: {
        //   screen: Home,
        //   navigationOptions: {
        //     tabBarLabel: "Home",
        //     tabBarIcon: ({ tintColor }) => (
        //       <FontAwesome name="home" size={30} color={tintColor} />
        //     )
        //   }
        // },
    },
    {
        // tabBarOptions: {
        //   style: {
        //     paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
        //   }
        // },
        //   headerMode: 'float',
        //   navigationOptions: ({navigation}) => ({
        //     headerStyle: {backgroundColor: '#4C3E54'},
        //     title: 'Welcome!',
        //     headerTintColor: 'white',
        //     gesturesEnabled: false,
        //     headerLeft: drawerButton(navigation)
        //   })
    }
);

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
