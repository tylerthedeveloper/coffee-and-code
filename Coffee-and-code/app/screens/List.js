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
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Modal from "react-native-modal";

export default class Example extends Component {
    constructor(props) {
        super();
        this.state = {
            visibleModal: null
        };
        console.log("constructpo");
    }

    renderButton = (text, onPress) => (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text>{text}</Text>
            </View>
        </TouchableOpacity>
    );

    renderModalContent = () => (
        <View style={styles.modalContent}>
            <Text>Hello!</Text>
            {this.renderButton("Close", () =>
                this.setState({ visibleModal: null })
            )}
        </View>
    );

    render() {
        console.log("render");
        return (
            <View style={styles.container}>
                {this.renderButton("Default modal", () =>
                    this.setState({ visibleModal: 1 })
                )}
                {this.renderButton(
                    "Modal that can be closed on backdrop press",
                    () => this.setState({ visibleModal: 6 })
                )}
                <Modal
                    isVisible={this.state.visibleModal === 1}
                    animationIn="slideInLeft"
                    animationOut="slideOutRight"
                    //   onBackdropPress={() => this.setState({ visibleModal: null })}
                >
                    {this.renderModalContent()}
                </Modal>
                <Modal
                    isVisible={this.state.visibleModal === 6}
                    onBackdropPress={() =>
                        this.setState({ visibleModal: null })
                    }
                >
                    {this.renderModalContent()}
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        backgroundColor: "lightblue",
        padding: 12,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    },
    scrollableModal: {
        height: 300
    },
    scrollableModalContent1: {
        height: 200,
        backgroundColor: "orange",
        alignItems: "center",
        justifyContent: "center"
    },
    scrollableModalContent2: {
        height: 200,
        backgroundColor: "lightgreen",
        alignItems: "center",
        justifyContent: "center"
    }
});
