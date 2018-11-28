import { createChatThread } from "../services/chat-service";

export const apiurl =
    "https://www.code-and-coffee2.azurewebsites.net/friend-requests";

// TODO: Test??
export function sendFriendRequest(
    usernameFrom,
    fromPhotoURL,
    usernameTo,
    toPhotoURL
) {
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
    return fetch(`${apiurl}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json"
        }
    }).then(res => res.json());
}

export function getSentFriendRequests(username) {
    return fetch(`${apiurl}/${username}/sent`, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    }).then(res => res.json());
}

export const getFriendRequestsReceived = username => {
    return fetch(
        `https://code-and-coffee2.azurewebsites.net/friend-requests/${username}/received`,
        {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        }
    ).then(res => res.json());
};

export const acceptFriendRequest = state => {
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
    return fetch(
        `https://code-and-coffee2.azurewebsites.net/friend-requests/accept`,
        {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json"
            }
        }
    )
        .then(res => res.json())
        .then(res => {
            console.log("cferthe ihrighroeg ");
            console.log(current_user, git_username);
            return createChatThread(current_user, git_username).then(res => ({
                current_user: false,
                git_username: git_username,
                isCurrentFriend: true
            }));
        });
};

//export function deleteFriendRequest(state) {
// const {
//     current_user,
//     current_user_picture_url,
//     user: { git_username, picture_url }
// } = state;
// const body = {
//     data: {
//         fromUser: {
//             git_username_from: git_username,
//             picture_url_from: picture_url
//         },
//         toUser: {
//             git_username_to: current_user,
//             picture_url_to: current_user_picture_url
//         }
//     }
// };
// console.log(body);
// return fetch(`${apiurl}/friend-requests/delete`, {
//     method: "POST",
//     body: JSON.stringify(body),
//     headers: {
//         "Content-type": "application/json"
//     }
// }).then(res => res.json());
//}
