import React, { Component } from "react";
import {
    ScrollView,
    Text,
    Linking,
    View,
    Alert,
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from "react-native";
import { Card, Button } from "react-native-elements";
import { Constants, Location, Permissions } from "expo";
import FriendsTab from "../component/FriendsTab";

const data = [];

export default class FriendsPage extends Component<Props> {
    constructor(props) {
        super();
        this.state = { friends: [] };
    }

    componentDidMount() {
        this.fetchDataFromUserbase();
    }

    componentWillMount() {}

    // fetchDataFromUserbase() {
    //   let username = "nishchayagupta";
    //   const URL = `https://coffee-and-code.azurewebsites.net/friend-requests/nishchayagupta/sent`;
    //   fetch(URL, {
    //     method: "GET",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json"
    //     }
    //   })
    //     .then(response => {
    //       return response.json();
    //     })
    //     .then(responseData => {
    //       return responseData.result;
    //     })
    //     .then(result => {
    //       this.setState({ friends: result });
    //     });
    // }

    render() {
        const {} = this.props;
        console.log(this.props);
        return (
            // <View style={styles.container}>
            <FriendsTab friends={this.state.friends_data} />
            // </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    button: {},
    buttonContainer: {}
});
