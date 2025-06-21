import { Injectable } from '@nestjs/common';
import { Role } from 'src/enums/role.enum';

interface User {
  userId: number;
  username: string;
  password: string;
  role: Role; // Optional role field
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      role: Role.User, // Assigning a role to the user
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      role: Role.Admin, // Assigning a role to the user
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async addUser(user: User): Promise<void> {
    this.users.push(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }
}
