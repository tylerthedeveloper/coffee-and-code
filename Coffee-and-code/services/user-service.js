https://stackoverflow.com/questions/44719103/singleton-object-in-react-native

import React, { Component } from "react";
import * as firebase from "firebase";
import { AsyncStorage } from "react-native";

export default class Profile extends Component<Props> {
    
    constructor() {
        super();
        this.state = {
            git_username: ""
        }
    }

    componentDidMount() {
        await AsyncStorage.getItem('git_username')
            .then(git_username => {
                console.log('git_username', git_username);
                this.setState({ git_username });
        });
    }

    retrieveUsername() {
        return this.state.git_username;
    }

    render() {
        const { navigation } = this.props;
        return;
    }
}