export class User{
    id: number = -1
    username: string = ''
    firstName: string = ''
    lastName: string = ''

    constructor(id: number, username: string, firstName: string, lastName: string){
        this.id = id
        this.username = username
        this.firstName = firstName
        this.lastName = lastName
    }
}