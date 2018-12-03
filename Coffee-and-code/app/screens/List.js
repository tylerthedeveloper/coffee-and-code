// import React, { Component } from "react";
// import {Modal, Text, TouchableHighlight, View, Alert, StyleSheet} from 'react-native';
// import { Card, Button } from "react-native-elements";
// import { Constants, Location, Permissions } from "expo";

// const data = [];

// export default class List extends Component<Props> {

//     constructor(props) {
//         super();
//         this.state = {
//             modalVisible: false,
//         };
//         console.log('constructpo');
//     }

//     componentWillMount() { }

//     setModalVisible(visible) {
//         this.setState({modalVisible: visible});
//       }

//       render() {
//         return (
//           <View style={{marginTop: 22}}>

//             <TouchableHighlight
//               onPress={() => {
//                 this.setModalVisible(true);
//               }}>
//               <Text>Show Modal</Text>
//             </TouchableHighlight>

//                         <Modal
//                             animationType="slide"
//                             transparent={false}
//                             visible={this.state.modalVisible}
//                             onRequestClose={() => {
//                                 Alert.alert('Modal has been closed.');
//                             }}>
//                             <View style={{marginTop: 22}}>
//                                 <View>
//                                 <Text>Hello World!</Text>

//                                 <TouchableHighlight
//                                     onPress={() => {
//                                     this.setModalVisible(!this.state.modalVisible);
//                                     }}>
//                                     <Text>Hide Modal</Text>
//                                 </TouchableHighlight>
//                                 </View>
//                             </View>
//                             </Modal>

//           </View>
//         );
//       }
// }

// const styles = StyleSheet.create({
//     container: {},
//     button: {},
//     buttonContainer: {}
// });

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

    onConfirm = () => {
        // Need Help value added on confirm button
        currentHelpItem = this.state.helpItems;
        curWillingItem = this.state.willingHelpItem;
        curTeamItem = this.state.teamItem;
        console.log("Current Help Item:", currentHelpItem);
        console.log("Current Willing Item:", curWillingItem);
        console.log("Current Team Item:", curTeamItem);

        // AsyncStorage.setItem("CurrItem", JSON.stringify(currentHelpItem));
    };

    onToggle(isOn) {
        console.log("Its on");
    }
    componentDidMount() {
        // AsyncStorage.setItem("CurrItem", JSON.stringify(items));
        AsyncStorage.getItem("CurrItem")
            .then(currentItem => JSON.parse(currentItem))
            .then(currData => this.setState({ helpItems: currData }));
        console.log("Did Mount sele item:", this.state.helpItems);
    }

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
                            onSelectedItemsChange={
                                this.onSelectedItemsChangeHelp
                            }
                            selectedItems={this.state.helpItems}
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
                            onSelectedItemsChange={
                                this.onSelectedItemsChangeWilling
                            }
                            selectedItems={this.state.willingHelpItem}
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
                            onSelectedItemsChange={
                                this.onSelectedItemsChangeTeam
                            }
                            selectedItems={this.state.teamItem}
                            onConfirm={this.onConfirm}
                        />
                    </Card>
                </ScrollView>

                <Button
                    style={styles.saveButton}
                    // styleDisabled={{color: 'red'}}
                    onPress={() => this.onConfirm()}
                    title="Save"
                >
                    Save
                </Button>
                {/* <TouchableHighlight
                    style={styles.saveButton}
                     onPress={() => this.submitSuggestion(this.props)}
                     >
                     <Text style={styles.submitText}>Submit</Text>
                </TouchableHighlight> */}
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
