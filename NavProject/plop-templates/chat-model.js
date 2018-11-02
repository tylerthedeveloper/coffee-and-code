export class chat_model{
  chat_list: 'string';
  active_chat: ['string'];
  sender: 'string';
  image: document.getElementByID('string');

  constructor(obj?: any){
    this.chat_list = obj.chat_list;
    this.active_chat = obj.active_chat;
    this.sender = obj.sender;
    this.image = obj.image;
  }
}
