// import { apiurl } from '../constants';
import { AsyncStorage } from "react-native";

const apiurl = "https://code-and-coffee2.azurewebsites.net/users";
// const apiurl = "http://192.168.64.220:3001/users";

export async function getLoggedinUserName() {
    return await AsyncStorage.getItem("git_username").then(
        git_username => git_username
    );
}

export async function getLoggedinUserProfile() {
    return await AsyncStorage.getItem("profile")
        .then(profile => JSON.parse(profile))
        .then(profile => profile);
}

// TODO: postgis?
export function getAllUsers() {
    return fetch(`${apiurl}`, {
        method: "GET"
        //headers: {
        //}
    })
        .then(res => res.json())
        .then(res => res.rows)
        .then(res => console.log(res));
}

export function getUserByID(git_username) {
    const body = {
        data: {
            git_username: {
                currentOp: "=",
                value: git_username,
                nextOp: null
            }
        }
    };
    return fetch(`${apiurl}/query`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json"
            // TODO: Credentials / accesstoken
        }
    })
        .then(res => res.json())
        .then(res => res.rows);
}

export function addNewUser(profile) {
    const body = {
        data: profile
    };
    // return fetch(`http://192.168.64.17:3001/users`, {
    return fetch(`${apiurl}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json"
            // TODO: Credentials / accesstoken
        }
    }).then(res => res);
}

export function addNewUserExpoNotiToken(git_username, token) {
    console.log("addNewUserExpoNotiToken");
    const body = {
        data: {
            git_username,
            expo_token: token
        }
    };
    // return fetch("http://192.168.64.17:3001/users/expo-token", {
    return fetch(`${apiurl}/expo-token`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json"
            // TODO: Credentials / accesstoken
        }
    }).then(res => console.log(res));
}

export async function updateLocationAndGetLocalUsers(user_location) {
    console.log("username", user_location.git_username);
    const {
        git_username,
        location: { latitude, longitude }
    } = user_location;
    const body = {
        data: {
            latitude,
            longitude
        }
    };
    // return fetch(`http://192.168.64.17:3001/users/${git_username}`, {
    return (
        fetch(`${apiurl}/${git_username}/update_location`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json"
            }
        })
            // .then(res => console.log("update_location", res));
            .then(res => res.json())
            .then(res => res.rows)
    );
}

export async function getLocalUsers(user_location) {
    const {
        git_username,
        location: { latitude, longitude }
    } = user_location;
    const body = {
        data: {
            latitude,
            longitude
        }
    };
    // return fetch(`http://192.168.64.17:3001/users/${git_username}/near-me`, {
    return (
        fetch(`${apiurl}/${git_username}/near-me`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json"
            }
        })
            // .then(res => console.log("near-me", res));
            .then(res => res.json())
            .then(res => res.rows)
    );
}

export async function updateUserSkills(user_skills) {
    console.log(user_skills);
    const { git_username, skills } = user_skills;
    console.log(git_username, skills);
    const body = {
        data: {
            skills
        }
    };
    return fetch(`${apiurl}/${git_username}/skills`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json"
        }
    })
        .then(res => res.json())
        .then(res => res.rows);
}

export async function updateUserPreferences(user_preferences) {
    console.log(user_preferences);
    const { git_username, preferences } = user_preferences;
    console.log(git_username, preferences);
    const body = {
        data: {
            preferences
        }
    };
    // return fetch(`http:192.168.64.17:3001/users/${git_username}`, {
    return fetch(`${apiurl}/${git_username}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json"
        }
    })
        .then(res => res.json())
        .then(res => res.rows);
}
