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
        `https://api.github.com/users/${username}`,
        `https://api.github.com/users/${username}/repos`
    ];
    const promises = urls.map(url => fetch(url).then(res => res.json()));
    return Promise.all(proimises).then(res => {
        const {
            id,
            login,
            avatar_url,
            followers,
            following,
            bio,
            name,
            company,
            blog,
            email
        } = res[0];
        const slimProfile = {
            bio: bio || "",
            blog: blog || "",
            company: company || "",
            current_location: null,
            email: email || "",
            git_username: login,
            latitude: 39.1653,
            longitude: 86.5264,
            name: name || "",
            picture_url: avatar_url,
            skills: {},
            user_id: id
        };
        const repos = res[1].map(repo => {
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
        return {
            profile: slimProfile,
            repos: repos
        };
    });
}
