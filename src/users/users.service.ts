import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/enums/role.enum';
import { User as UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { User as User_ } from './user.schema';

interface User {
  userId: number;
  username: string;
  password: string;
  role: Role; // Optional role field
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectModel(User_.name) private userModel: Model<UserDocument>,
  ) {}

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

  // async findOne(username: string): Promise<User | undefined> {
  //   return this.users.find((user) => user.username === username);
  // }

  // async addUser(user: User): Promise<void> {
  //   this.users.push(user);
  // }

  // async getAllUsers(): Promise<User[]> {
  //   return this.users;
  // }

  //* TypeORM:
  
  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // findOne(username: string): Promise<User | null> {
  //   return this.usersRepository.findOne({ where: { username } });
  // }

  // addUser(user: Partial<User>): Promise<User> {
  //   const newUser = this.usersRepository.create(user);
  //   return this.usersRepository.save(newUser);
  // }

  //* Mongo:

  async addUser({
    username,
    password,
    role,
  }: {
    username: string;
    password: string;
    role: Role;
  }) {
    const created = new this.userModel({ username, password, role });
    return created.save();
  }

  async findOne(username: string) {
    return this.userModel.findOne({ username });
  }
}
