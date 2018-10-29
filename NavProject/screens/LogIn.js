import React from "react";
import { View } from "react-native";
import {Card, Button} from "react-native-elements";

const onSignIn = () => new Promise((res, rej) => { 

  // AsyncStorage.setItem(USER_KEY, "true");
  res('signedIn');

});


export default ({ navigation }) => (
  <View style={{ paddingVertical: 20 }}>
    <Card>
      <Button
        buttonStyle={{ marginTop: 20 }}
        backgroundColor="#03A9F4"
        title="Login with GitHub"
        onPress={() => {
          onSignIn().then(() => navigation.navigate("SignedIn"));
        }}
      />
    </Card>
  </View>
);