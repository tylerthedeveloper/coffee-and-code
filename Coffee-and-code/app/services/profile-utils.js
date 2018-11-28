import { AsyncStorage } from "react-native";

// TODO: send nav
export function logout(navigation) {
    AsyncStorage.multiRemove([
        "profile",
        "git_username",
        "current_user_picture_url",
        "@Expo:GithubToken"
    ]).then(() => navigation.navigate("SignedOut"));
}

// TODO: send nav
export function sendMessage(onSendMessageTo, navigation) {
    this.props.navigation.navigate("Chat", {
        onSendMessageTo: onSendMessageTo
    });
}
