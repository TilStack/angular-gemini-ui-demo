import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: User[] = [];
  constructor() { 
    this.users.push(new User(1, 'admin', 'Admin', 'User'));
    this.users.push(new User(2, 'user', 'Normal', 'User'));
    this.users.push(new User(3, 'guest', 'Guest', 'User'));
  }

  get(id: number | null): User | null{
    return this.users.find(user => user.id === id) || null;
  } 

}
