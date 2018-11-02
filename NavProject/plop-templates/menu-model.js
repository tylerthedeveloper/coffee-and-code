export class menu_model{
    name: 'string';
    image: document.getElementByID('string');
    profile_button: document.createElement("button");
    setting_button: document.createElement("button");
    chat_button: document.createElement("button");
    logout_button: document.createElement("button");

    constructor(obj?: any){
    this.name = obj.skills;
    this.image = obj.image;
    this.profile_button = obj.profile_button
    this.setting_button = obj.setting_button;
    this.chat_button = obj.chat_button;
    this.logout_button = obj.logout_button;


}
}
