import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
import { Card } from "react-native-elements";
import ToggleSwitch from "toggle-switch-react-native";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
// import MultiSelect from "react-native-multiple-select";
const { width, height } = Dimensions.get("window");
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
        <ScrollView style={{ height: height * 0.75 }}>
          <Card>
            <View style={{ flexDirection: "row", flex: 1, display: "flex" }}>
              <Text
                style={{
                  flex: 1,
                  padding: 10,
                  fontSize: 20,
                  fontWeight: "bold"
                }}
              >
                Need Help
              </Text>

              <ToggleSwitch
                style={{ padding: 10 }}
                isOn={this.state.needHelpSwitch}
                onToggle={needHelpSwitch => {
                  this.setState({ needHelpSwitch });
                }}
              />
            </View>
            <SectionedMultiSelect
              items={items}
              uniqueKey="name"
              subKey="children"
              selectText="Choose any Language"
              showDropDowns={true}
              readOnlyHeadings={true}
              onSelectedItemsChange={this.onSelectedItemsChangeHelp}
              selectedItems={this.state.helpItems}
            />
          </Card>

          <Card>
            <View style={{ flexDirection: "row", flex: 1, display: "flex" }}>
              <Text
                style={{
                  flex: 1,
                  padding: 10,
                  fontSize: 20,
                  fontWeight: "bold"
                }}
              >
                Willing To Help
              </Text>

              <ToggleSwitch
                style={{ padding: 10 }}
                isOn={this.state.willHelpSwitch}
                onToggle={willHelpSwitch => {
                  this.setState({ willHelpSwitch });
                }}
              />
            </View>
            <SectionedMultiSelect
              items={items}
              uniqueKey="name"
              subKey="children"
              selectText="Choose any Language"
              showDropDowns={true}
              readOnlyHeadings={true}
              onSelectedItemsChange={this.onSelectedItemsChangeWilling}
              selectedItems={this.state.willingHelpItem}
            />
          </Card>

          <Card>
            <View style={{ flexDirection: "row", flex: 1, display: "flex" }}>
              <Text
                style={{
                  flex: 1,
                  padding: 10,
                  fontSize: 20,
                  fontWeight: "bold"
                }}
              >
                Tutor
              </Text>

              <ToggleSwitch
                style={{ padding: 10 }}
                isOn={this.state.teamSwitch}
                onToggle={teamSwitch => {
                  this.setState({ teamSwitch });
                }}
              />
            </View>
            <SectionedMultiSelect
              items={items}
              uniqueKey="name"
              subKey="children"
              selectText="Choose any Language"
              showDropDowns={true}
              readOnlyHeadings={true}
              onSelectedItemsChange={this.onSelectedItemsChangeTeam}
              selectedItems={this.state.teamItem}
            />
          </Card>
        </ScrollView>
        <View
          style={{
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 4,
            borderColor: "rgba(0, 0, 0, 0.1)",
            height: height * 0.25
          }}
        >
          <TouchableOpacity
            style={styles.saveButton}
            // styleDisabled={{color: 'red'}}
            onPress={() => this.save()}
            title="Save"
          >
            <View>
              <Text style={{ color: "white", fontWeight: "bold" }}>Save</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "column"
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  card: {
    color: "powderblue",
    flexDirection: "row"
  },
  saveButton: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: "#4D90FE",
    elevation: 2, // Android
    height: 50,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 30,
    borderColor: "steelblue",
    borderWidth: 3,
    marginBottom: height * 0.1
  },

  submitText: {
    color: "#fff",
    textAlign: "center"
  }
});
