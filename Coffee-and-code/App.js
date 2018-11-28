import React from "react";
import { createRootNavigator } from "./app/router/route";
import * as firebase from 'firebase';
import initializeFirebase from './app/screens/LogIn';
// import attemptToRestoreAuthAsync from './app/screens/LogIn';
// import firebaseConfig from './firebaseConfig'
import firestore from 'firebase/firestore';
import { Text, AsyncStorage } from "react-native";

// TODO: environment
  const firebaseConfig = {
    apiKey: "AIzaSyCoeV0BahxO-nKIFPVw8rEDjsxtH9xI2GM",
    authDomain: "coffee-and-code-41247.firebaseapp.com",
    databaseURL: "https://coffee-and-code-41247.firebaseio.com",
    projectId: "coffee-and-code-41247",
    storageBucket: "coffee-and-code-41247.appspot.com",
    messagingSenderId: "115392856682"
  };
  const settings = { timestampsInSnapshots: true };

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
    };
  }

  setupFirebaseAsync = async () => {
    // Prevent reinitializing the app in snack.
    if (!firebase.apps.length) {
      return firebase.initializeApp(firebaseConfig);
    }
  }
    
  async componentDidMount() {
    this.setupFirebaseAsync();
    // firestore.settings(settings);
    await AsyncStorage.getItem("git_username")
      .then(res => {
        // const signedIN = (res !== undefined);
          if (res) {
            this.setState({
              signedIn: true
            });
          } else {
            this.setState({
              signedIn: false
            });
          }
      });
  }

  render() {
    const { signedIn } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    const RootStack = createRootNavigator(signedIn);
    return <RootStack />;
  }
}