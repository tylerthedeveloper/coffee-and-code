import * as React from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableHighlight,
    Animated
} from "react-native";
import { Card } from "react-native-elements";

export default class AssetExample extends React.Component {
    constructor() {
        super();

        this.icons = {
            //Step 2
            up: require("../../assets/arrow-up-01-512.png"),
            down: require("../../assets/arrow-down-01-512.png")
        };

        this.state = {
            //Step 3
            expanded: false,
            animation: new Animated.Value()
        };
    }

    _setMaxHeight(event) {
        this.setState({
            maxHeight: event.nativeEvent.layout.height
        });
    }

    _setMinHeight(event) {
        this.setState({
            minHeight: event.nativeEvent.layout.height
        });
    }

    toggle() {
        //Step 1
        let initialValue = this.state.expanded
                ? this.state.maxHeight + this.state.minHeight
                : this.state.minHeight,
            finalValue = this.state.expanded
                ? this.state.minHeight
                : this.state.maxHeight + this.state.minHeight + 100;

        this.setState({
            expanded: !this.state.expanded //Step 2
        });

        this.state.animation.setValue(initialValue); //Step 3
        Animated.spring(
            //Step 4
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start(); //Step 5
    }

    render() {
        let icon = this.icons["down"];
        if (this.state.expanded) {
            icon = this.icons["up"]; //Step 4
        }
        return (
            <Card style={{ padding: 10, color: "powderblue" }}>
                <Animated.View
                    style={[styles.container, { height: this.state.animation }]}
                >
                    <View style={styles.titleContainer}>
                        <Text
                            style={styles.title}
                            onLayout={this._setMinHeight.bind(this)}
                        >
                            {this.props.repo.repo_name} (
                            {this.props.repo.language})
                        </Text>
                        <TouchableHighlight
                            style={styles.button}
                            onPress={this.toggle.bind(this)}
                            underlayColor="#f1f1f1"
                        >
                            <Image style={styles.buttonImage} source={icon} />
                        </TouchableHighlight>
                    </View>
                    <View>
                        <Text>
                            Stargazers Count :{" "}
                            {this.props.repo.stargazers_count}
                        </Text>
                        <Text>Forks Count : {this.props.repo.forks_count}</Text>
                        <Text>Description : {this.props.repo.description}</Text>
                        <Text>Repo URL : {this.props.repo.repo_url}</Text>
                    </View>
                    <View
                        style={styles.body}
                        onLayout={this._setMaxHeight.bind(this)}
                    >
                        {this.props.children}
                    </View>
                </Animated.View>
            </Card>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        margin: 10,
        overflow: "hidden"
    },
    titleContainer: {
        flexDirection: "row"
    },
    title: {
        flex: 1,
        padding: 0,
        color: "#2a2f43",
        fontWeight: "bold"
    },
    button: {},
    buttonImage: {
        width: 30,
        height: 25
    },
    body: {
        padding: 10,
        paddingTop: 0
    }
});
