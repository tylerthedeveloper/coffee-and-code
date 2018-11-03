export class {{ pascalCase name }} {

    {{ camelCase name }}ID: string;

    constructor(obj?: any) {
        this.{{ camelCase name }}ID = obj.{{ camelCase name }}ID;
    }

}
