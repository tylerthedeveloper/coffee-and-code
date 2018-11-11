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

export default class Repo extends Component<Props> {
    constructor(props) {
        super();
        this.state = {};
    }

    componentWillMount() {}

    render() {
        const {} = this.props;
        console.log(this.props);
        return (
            <ScrollView>
                {this.props.repoData.map(repo => (
                    <ScrollView
                        key={repo.id}
                        horizontal={true}
                        style={styles.textarea}
                    >
                        <Text>
                            Project Title: {repo.title} {"\n"}
                            Language : {repo.language} {"\n"}
                            Description : {repo.desc} {"\n"}
                        </Text>
                    </ScrollView>
                ))}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    button: {},
    buttonContainer: {},
    textarea: {
        width: 200,
        height: 100,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: "#d6d7da"
    }
});
