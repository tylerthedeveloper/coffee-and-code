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

export default class PersonList extends Component<Props> {
    constructor(props) {
        super();
        this.state = {};
    }

    componentWillMount() {}

    render() {
        const {} = this.props;
        return (
            <ScrollView>
                {this.props.markers.map(marker => (
                    <Card key={marker.key}>
                        <Text style={{ marginBottom: 10 }}>
                            {" "}
                            NAME: {marker.name}{" "}
                        </Text>
                        <Text style={{ marginBottom: 10 }}>
                            {" "}
                            USERNAME: {marker.git_username}{" "}
                        </Text>
                        <Text style={{ marginBottom: 10 }}>
                            {" "}
                            BIO: {marker.bio}{" "}
                        </Text>
                    </Card>
                ))}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    button: {},
    buttonContainer: {}
});
