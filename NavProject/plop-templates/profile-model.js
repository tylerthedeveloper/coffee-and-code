export class profile_model {
    userID: string;
    username: string;
    GitID: string;
    age: string;
    first_name: string;
    last_name: string;
    city: string;
    bio: string;
    company: string;
    projects: string;
    skills: string;

    constructor(obj?: any){
        this.userID = obj.userID;
        this.username = obj.username;
        this.GitID = obj.GitID;
        this.age = obj.age;
        this.first_name = obj.first_name;
        this.last_name = obj.last_name;
        this.city = obj.city;
        this.bio = obj.bio;
        this.company = obj.company;
        this.projects = obj.projects;
        this.skills = obj.skills;
}

}
