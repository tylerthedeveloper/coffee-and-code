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
    })
        .then(res => res.json())
        .then(res => res.rows)
        .then(rows => console.log(rows));
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
        .then(res => res.rows)
        .then(rows => console.log(rows));
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
