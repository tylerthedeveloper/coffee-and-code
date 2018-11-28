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

export function fetchGitData(username) {
    const urls = [
        `https://api.github.com/users/${username}/repos`,
        `https://api.github.com/users/${username}`
    ];
    const promises = urls.map(url => fetch(url).then(res => res.json()));
    return Promise.all(
        promises
        // urls.map(url => fetch(url).then(res => res.json()))
    ).then(res => {
        const repos = res[0].map(repo => {
            const {
                id,
                name,
                language,
                description,
                html_url,
                created_at,
                forks_count,
                stargazers_count,
                owner
            } = repo;
            const slimRepo = {
                repoID: id,
                user_name: owner.login,
                repo_name: name,
                language: language || "Not specified",
                description: description || "",
                repo_url: html_url,
                creation_date: created_at,
                forks_count: forks_count,
                stargazers_count: stargazers_count
            };
            return slimRepo;
        });

        const {
            id,
            login,
            avatar_url,
            followers,
            following,
            // public_repos,
            bio,
            name
        } = res[1];
        const slimProfile = {
            bio: bio || "",
            // TODO: Location ... ?
            current_latitude: 39.1653,
            current_location: null,
            current_longitude: 86.5264,
            git_username: login,
            name: name || "",
            picture_url: avatar_url,
            user_id: id
            // TODO: update db
            // followers: followers,
            // following: following,`
            // TODO: pull ..
        };
        // console.log("Profile:", slimProfile);
        return {
            profile: slimProfile,
            repos: repos
        };
    });
}
