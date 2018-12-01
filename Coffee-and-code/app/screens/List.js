import React, { Component } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    AsyncStorage
} from "react-native";
import PropTypes from "prop-types";
import { Card } from "react-native-elements";
import ToggleSwitch from "toggle-switch-react-native";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import MultiSelect from "react-native-multiple-select";

const items = [
    {
        name: "Front End",
        id: 0,
        children: [
            {
                name: "React Native",
                id: 10
            },
            {
                name: "HTML",
                id: 17
            },
            {
                name: "CSS",
                id: 13
            }
        ]
    },
    {
        name: "Back End",
        id: 1,
        children: [
            {
                name: "Java",
                id: 20
            },
            {
                name: "PHP",
                id: 21
            }
        ]
    }
];
const currentHelpItem = [];

export default class List extends Component<props> {
    state = {
        isOnDefaultToggleSwitch: false,
        selectedItems: []
        //currentItems: []
    };

    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
        console.log("Selected item:", selectedItems);
    };

    onConfirm = () => {
        currentHelpItem = this.state.selectedItems;
        console.log("Current Item:", currentHelpItem);
        AsyncStorage.setItem("CurrItem", JSON.stringify(currentHelpItem));
    };

    onCancel = () => {
        currentHelpItem = this.state.selectedItems;
        console.log("Current Item:", currentHelpItem);
        AsyncStorage.setItem("CurrItem", JSON.stringify(currentHelpItem));
    };

    onToggle(isOn) {
        console.log("Its on");
    }
    componentDidMount() {
        AsyncStorage.getItem("CurrItem")
            .then(currentItem => JSON.parse(currentItem))
            .then(currData => this.setState({ selectedItems: currData }));
        console.log("Did Mount sele item:", this.state.selectedItems);
    }

    render() {
        return (
            <View style={styles.container}>
                <Card
                    style={{
                        padding: 150,
                        color: "powderblue",
                        flexDirection: "row"
                    }}
                >
                    <Text style={styles.welcome}>Need Help</Text>

                    <ToggleSwitch
                        isOn={this.state.isOnDefaultToggleSwitch}
                        onToggle={isOnDefaultToggleSwitch => {
                            this.setState({ isOnDefaultToggleSwitch });
                            this.onToggle(isOnDefaultToggleSwitch);
                        }}
                    />
                    <SectionedMultiSelect
                        items={items}
                        uniqueKey="name"
                        subKey="children"
                        selectText="Choose any Language"
                        showDropDowns={true}
                        readOnlyHeadings={true}
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        selectedItems={this.state.selectedItems}
                        onCancel={this.onCancel}
                        onConfirm={this.onConfirm}
                    />
                </Card>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        flexDirection: "row"
    },
    welcome: {
        fontSize: 20,
        textAlign: "left",
        margin: 20,
        flexDirection: "row"
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5
    }
});
