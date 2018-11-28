// import { apiurl } from '../constants';
import { AsyncStorage } from "react-native";

const apiurl = "https://code-and-coffee2.azurewebsites.net";

export async function getLoggedinUserName() {
    return await AsyncStorage.getItem("git_username").then(
        git_username => git_username
    );
}

// TODO: postgis?
export function getAllUsers() {
    return fetch(`${apiurl}/users`, {
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

    return fetch(`${apiurl}/users/query`, {
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
    return fetch(`${apiurl}/users`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json"
            // TODO: Credentials / accesstoken
        }
    }).then(res => res);
}

export function sendLocation(user_location) {
    const {
        git_username,
        location: { latitude, longitude }
    } = user_location;
    const body = {
        data: {
            current_latitude: latitude,
            current_longitude: longitude
        }
    };
    console.log(body);
    // return fetch(`${apiurl}/users/`, {
    //     method: "POST",
    //     body: JSON.stringify(body),
    //     headers: {
    //         "Content-type": "application/json"
    //         // TODO: Credentials / accesstoken
    //     }
    // }).then(res => res);
}
