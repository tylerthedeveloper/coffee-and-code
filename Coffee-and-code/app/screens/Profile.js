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

const data = [];

export default class Profile extends Component<Props> {
    constructor(props) {
        super();
        this.state = {};
    }

    componentDidMount() {}

    render() {
        const {} = this.props;
        console.log(this.props);
        return <View style={styles.container} />;
    }
}

const styles = StyleSheet.create({
    container: {},
    button: {},
    buttonContainer: {}
});