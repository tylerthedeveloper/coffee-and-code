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
// import MultiSelect from "react-native-multiple-select";

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
const curWillingItem = [];
const curTeamItem = [];

export default class List extends Component<props> {
    state = {
        needHelpSwitch: false,
        willHelpSwitch: false,
        teamSwitch: false,
        helpItems: [],
        willingHelpItem: [],
        teamItem: []
        //currentItems: []
    };

    onSelectedItemsChangeHelp = helpItems => {
        this.setState({ helpItems });
        console.log("Help item:", helpItems);
        return helpItems;
    };
    onSelectedItemsChangeTeam = teamItem => {
        this.setState({ teamItem });
        console.log("Team item:", teamItem);
        return teamItem;
    };

    onSelectedItemsChangeWilling = willingHelpItem => {
        this.setState({ willingHelpItem });
        console.log("Willing item:", willingHelpItem);
        return willingHelpItem;
    };

    save = () => {
        // Need Help value added on confirm button
        currentHelpItem = this.state.helpItems;
        curWillingItem = this.state.willingHelpItem;
        curTeamItem = this.state.teamItem;
        let finalList = {
            need_help: currentHelpItem,
            will_help: curWillingItem,
            will_tutor: curTeamItem
        };
        console.log("Final List:", finalList);
        // navigation.getParam("passProps").callback({
        //     skills: ["C", "Java", "Python"],
        //     will_help: ["B", "D", "F"],
        // });
        this.props.navigation.getParam("passProps").callback({ finalList });
        this.props.navigation.pop();
    };

    componentDidMount() {}

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Card style={styles.card}>
                        <Text style={styles.welcome}>Need Help</Text>

                        <ToggleSwitch
                            isOn={this.state.needHelpSwitch}
                            onToggle={needHelpSwitch => {
                                this.setState({ needHelpSwitch });
                            }}
                        />
                        <SectionedMultiSelect
                            items={items}
                            uniqueKey="name"
                            subKey="children"
                            selectText="Choose any Language"
                            showDropDowns={true}
                            readOnlyHeadings={true}
                            onSelectedItemsChange={
                                this.onSelectedItemsChangeHelp
                            }
                            selectedItems={this.state.helpItems}
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
                            }}
                        />
                        <SectionedMultiSelect
                            items={items}
                            uniqueKey="name"
                            subKey="children"
                            selectText="Choose any Language"
                            showDropDowns={true}
                            readOnlyHeadings={true}
                            onSelectedItemsChange={
                                this.onSelectedItemsChangeWilling
                            }
                            selectedItems={this.state.willingHelpItem}
                        />
                    </Card>

                    <Card
                        style={{
                            padding: 150,
                            color: "powderblue",
                            flexDirection: "row"
                        }}
                    >
                        <Text style={styles.welcome}>Tutor</Text>

                        <ToggleSwitch
                            isOn={this.state.teamSwitch}
                            onToggle={teamSwitch => {
                                this.setState({ teamSwitch });
                            }}
                        />
                        <SectionedMultiSelect
                            items={items}
                            uniqueKey="name"
                            subKey="children"
                            selectText="Choose any Language"
                            showDropDowns={true}
                            readOnlyHeadings={true}
                            onSelectedItemsChange={
                                this.onSelectedItemsChangeTeam
                            }
                            selectedItems={this.state.teamItem}
                        />
                    </Card>
                </ScrollView>
                <Button
                    style={styles.saveButton}
                    // styleDisabled={{color: 'red'}}
                    onPress={() => this.save()}
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
