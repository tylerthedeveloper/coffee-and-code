import React, { Component } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    AsyncStorage,
    ScrollView,
    TouchableHighlight
} from "react-native";
import PropTypes from "prop-types";
import { Card } from "react-native-elements";
import ToggleSwitch from "toggle-switch-react-native";
import SectionedMultiSelect from "react-native-sectioned-multi-select";

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

export default class List extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            isOnDefaultToggleSwitch: false,
            selectedItems: [],
            needHelpSwitch: false,
            willHelpSwitch: false,
            teamSwitch: false
        };
    }

    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
        console.log("Selected item:", selectedItems);
    };

    onConfirm = () => {
        // Need Help value added on confirm button
        currentHelpItem = this.state.selectedItems;
        console.log("Current Item:", currentHelpItem);
        AsyncStorage.setItem("CurrItem", JSON.stringify(currentHelpItem));
    };

    onToggle(isOn) {
        console.log("Its on");
    }
    componentDidMount() {
        // AsyncStorage.setItem("CurrItem", JSON.stringify(items));
        AsyncStorage.getItem("CurrItem")
            .then(currentItem => JSON.parse(currentItem))
            .then(currData => this.setState({ selectedItems: currData }));
        console.log("Did Mount sele item:", this.state.selectedItems);
    }

    render() {
        const { navigation } = this.props;

        return (
            <View style={styles.container}>
                <ScrollView>
                    <Card style={styles.card}>
                        <Text style={styles.welcome}>Need Help</Text>

                        <ToggleSwitch
                            isOn={this.state.needHelpSwitch}
                            onToggle={needHelpSwitch => {
                                this.setState({ needHelpSwitch });
                                this.onToggle(needHelpSwitch);
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
                            //onConfirm={this.onConfirm}
                        />
                    </Card>

                    <Card
                        style={{
                            padding: 150,
                            color: "powderblue",
                            flexDirection: "row"
                        }}
                    >
                        <Text style={styles.welcome}>Willing To Help</Text>

                        <ToggleSwitch
                            isOn={this.state.willHelpSwitch}
                            onToggle={willHelpSwitch => {
                                this.setState({ willHelpSwitch });
                                this.onToggle(willHelpSwitch);
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
                            onConfirm={this.onConfirm}
                        />
                    </Card>

                    <Card
                        style={{
                            padding: 150,
                            color: "powderblue",
                            flexDirection: "row"
                        }}
                    >
                        <Text style={styles.welcome}>Let's Make A Team</Text>

                        <ToggleSwitch
                            isOn={this.state.teamSwitch}
                            onToggle={teamSwitch => {
                                this.setState({ teamSwitch });
                                this.onToggle(teamSwitch);
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
                            onConfirm={this.onConfirm}
                        />
                    </Card>
                </ScrollView>

                <Button
                    style={styles.saveButton}
                    // styleDisabled={{color: 'red'}}
                    onPress={() => navigation.pop()}
                    title="Save"
                >
                    Save
                </Button>
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
        flexDirection: "column"
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
    },
    card: {
        padding: 150,
        color: "powderblue",
        flexDirection: "row"
    },
    saveButton: {
        zIndex: 1,
        // backgroundColor:"#841584",
        // borderRadius:30,
        // overflow: 'hidden',
        // paddingTop:20,
        marginRight: 40,
        marginLeft: 40,
        marginTop: 10,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: "#68a0cf",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#fff"
    },

    submitText: {
        color: "#fff",
        textAlign: "center"
    }
});
