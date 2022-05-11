import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './user.constants';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async findByUserId(userId: string): Promise<UserModel | null> {
    const user = this.userModel.findById(userId);
    return user;
  }

  async findAll(): Promise<UserModel[]> {
    return this.userModel.find().exec();
  }

  async findByUserEmail(email: string) {
    const user = await this.userModel.findOne({
      userEmail: email,
    });

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    const salt = await genSalt(10);
    const newUser: CreateUserDto = {
      ...createUserDto,
      userPassword: await hash(createUserDto.userPassword, salt),
    };

    return this.userModel.create(newUser);
  }

  async delete(id: string): Promise<UserModel | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async update(updateUserDto: UpdateUserDto): Promise<UserModel | null> {
    const user = await this.userModel.findById(updateUserDto.userId);
    user.userName = updateUserDto.userName;
    user.userEmail = updateUserDto.userEmail;

    return user.save();
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'userEmail'>> {
    const user = await this.findByUserEmail(email);
    const isCorrectPassword = await compare(password, user.userPasswordHash);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }

    return { userEmail: user.userEmail };
  }

  async login(email: string) {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      }),
    };
  }
}
