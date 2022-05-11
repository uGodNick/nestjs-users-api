import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ALREADY_REGISTERED_ERROR,
  USER_NOT_FOUND_ERROR,
} from './user.constants';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param() id: string) {
    console.log('(get) params: ' + id);
    const user = await this.userService.findByUserId(id);
    if (!user) {
      throw new HttpException(USER_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Get('all/list')
  async getUsers() {
    return this.userService.findAll();
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  async register(@Body() dto: CreateUserDto) {
    const oldUser = await this.userService.findByUserEmail(dto.userEmail);

    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }

    return this.userService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Param() id: string) {
    const deletedUser = await this.userService.delete(id);
    if (!deletedUser) {
      throw new HttpException(USER_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch('update')
  async update(@Body() dto: UpdateUserDto) {
    this.userService.update(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    const { userEmail } = await this.userService.validateUser(
      dto.userEmail,
      dto.userPassword,
    );

    return this.userService.login(userEmail);
  }
}
