export function postUserFriendRequest(
    usernameFrom,
    fromPhotoURL,
    usernameTo,
    toPhotoURL
) {
    const apiurl =
        "https://www.coffee-and-code.azurewebsites.net/friend-requests";
    const body = {
        data: {
            fromUser: {
                git_username_from: usernameFrom,
                picture_url_from: fromPhotoURL
            },
            toUser: {
                git_username_to: usernameTo,
                picture_url_to: toPhotoURL
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
    }).then(res => res.json());
    // .then(res => res.rows)
    // .then(rows => console.log(rows));
}

export function getSentRequests(username) {
    const apiurl =
        "https://www.coffee-and-code.azurewebsites.net/friend-requests";

    return fetch(`${apiurl}/${username}/sent`, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
            // TODO: Credentials / accesstoken
        }
    })
        .then(res => res.json())
        .then(res => res.rows);
}

export function getReceivedRequests(username) {
    const apiurl =
        "https://www.coffee-and-code.azurewebsites.net/friend-requests";

    return fetch(`${apiurl}/${username}/received`, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
            // TODO: Credentials / accesstoken
        }
    })
        .then(res => res.json())
        .then(res => res.rows)
        .then(rows => console.log(rows));
}

export function acceptFriendRequest(state) {
    const {
        current_user,
        current_user_picture_url,
        user: { git_username, picture_url }
    } = state;
    const body = {
        data: {
            fromUser: {
                git_username_from: git_username,
                picture_url_from: picture_url
            },
            toUser: {
                git_username_to: current_user,
                picture_url_to: current_user_picture_url
            }
        }
    };
    console.log(body);
    return fetch(`${apiurl}/friend-requests/accept`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json"
            // TODO: Credentials / accesstoken
        }
    }).then(res => res.json());
}

export function deleteFriendRequest(state) {
    const {
        current_user,
        current_user_picture_url,
        user: { git_username, picture_url }
    } = state;
    const body = {
        data: {
            fromUser: {
                git_username_from: git_username,
                picture_url_from: picture_url
            },
            toUser: {
                git_username_to: current_user,
                picture_url_to: current_user_picture_url
            }
        }
    };
    console.log(body);
    return fetch(`${apiurl}/friend-requests/delete`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json"
            // TODO: Credentials / accesstoken
        }
    }).then(res => res.json());
}
