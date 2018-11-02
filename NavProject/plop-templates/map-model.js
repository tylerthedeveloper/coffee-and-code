export class map_model{
    name: 'string';
    location: 'string';
    skills: 'string';
    image: document.getElementByID('string');
    filter_button: document.createElement("button");

    constructor(obj?: any){
    this.skills = obj.skills;
    this.image = obj.image;
    this.filter_button = obj.filter_button;

}
}
