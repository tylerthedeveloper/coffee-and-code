export function logout() {
    AsyncStorage.multiRemove([
        "profile",
        "git_username",
        "current_user_picture_url",
        "@Expo:GithubToken"
    ]).then(() => this.props.navigation.navigate("SignedOut"));
}

export function sendMessage(onSendMessageTo) {
    this.props.navigation.navigate("Chat", {
        onSendMessageTo: onSendMessageTo
    });
}
