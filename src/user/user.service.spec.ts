import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { getJWTConfig } from '../configs/jwt.config';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  const exec = { exec: jest.fn() };
  const userRepositoryFactory = () => ({
    find: () => exec,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: getJWTConfig,
        }),
      ],
      providers: [
        UserService,
        {
          useFactory: userRepositoryFactory,
          provide: getModelToken('UserModel'),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByUserId - saccess', async () => {
    const id = new Types.ObjectId().toHexString();
    userRepositoryFactory()
      .find()
      .exec.mockReturnValueOnce([{ userId: id }]);
    const res = await service.findByUserId(id);
    expect(res.userId).toBe(id);
  });
});
