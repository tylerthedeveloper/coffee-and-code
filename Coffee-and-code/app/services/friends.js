export function postUserFriendRequest(username) {
    const apiurl =
        "https://www.coffee-and-code.azurewebsites.net/friends/query";
    const body = {
        data: {
            gitusername_1: {
                currentOp: "=",
                value: username,
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
        .then(res => res.rows)
        .then(rows => console.log(rows));
}
