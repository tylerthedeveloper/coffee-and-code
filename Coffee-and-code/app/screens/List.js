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

const data = [

];

export default class List extends Component<Props> {

    constructor(props) {
        super();
        this.state = {

        };
    }

    componentWillMount() {

    }


    render() {
        const {  } = this.props;
        console.log(this.props);
        return (
            <View style={styles.container}>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
    },
    button: {
    },
    buttonContainer: {
    }
});
