const apiurl = "https://code-and-coffee2.azurewebsites.net";

export function getAllUsers() {
    return fetch(`${apiurl}/users`, {
        method: "GET"
        //headers: {
        //}
    })
        .then(res => res.json())
        .then(res => console.log(res.rows));
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
    // .then(rows => console.log(rows));
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
// TODO: export as class, object, etc.
