const axios = require("axios");
const url =
    "https://github.com/login/oauth/authorize?client_id=6d895b446d3b611a61bc&redirect_uri=https%253A%252F%252Fauth.expo.io%252F%2540arpibhat%252FCoffee-and-code&scope=user%20public_repo%20repo%20repo_deployment%20repo%3Astatus%20read%3Arepo_hook%20read%3Aorg%20read%3Apublic_key%20read%3Agpg_key";

axios.get(url).then(res => console.log(res));
