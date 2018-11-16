const apiurl = "https://coffee-and-code.azurewebsites.net";

export function getAllUsers() {
    return fetch(`${apiurl}/users`, {
        method: "GET"
        //headers: {
        //}
    })
        .then(res => res.json())
        .then(res => console.log(res.rows));
}

export function getUserByID(gitusername) {
    const body = {
        data: {
            git_username: {
                currentOp: "=",
                value: gitusername,
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

// TODO: export as class, object, etc.
