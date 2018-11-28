export function addRepos(repos) {
    const apiurl = "https://code-and-coffee2.azurewebsites.net";
    const body = {
        data: repos
    };
    return fetch(`${apiurl}/repos`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json"
            // TODO: Credentials / accesstoken
        }
    }).then(res => res);
}
