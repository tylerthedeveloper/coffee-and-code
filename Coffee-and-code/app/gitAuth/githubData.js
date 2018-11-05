import githubFields from "./getGitHubToken";


export default function populateUserGithubData(){
  console.log("Entered populateUserGithubData ");
  fetch('https://api.github.com/users/arpit2010', {
    method: 'GET',
    headers: {
    "Accept": "application/json",
    'Content-Type': 'application/json'
    }
})
.then(response => { return response.json();})
.then(responseData => {console.log(responseData); return responseData;})
.then(data => {this.setState({"questions" : data});})

.catch(err => {
    console.log("fetch error" + err);
});
}
     // console.log(userData);
  
