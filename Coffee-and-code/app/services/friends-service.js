export const getFriends = git_username => {
    const friendBody = {
        data: {
            gitusername_1: {
                currentOp: "=",
                value: git_username,
                nextOp: null
            }
        }
    };
    const friendsPromise = fetch(
        "https://code-and-coffee2.azurewebsites.net/friends/query",
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(friendBody)
        }
    )
        .then(res => res.json())
        .then(res => res.rows);
    // TODO: Do we need to store it ?
    return friendsPromise;
};
