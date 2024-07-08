import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { User as UserEntity, User } from './user.entity';

import { CreateUserDto as UserModel } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UserService {
    private saltRounds: number;

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,

    ) {
        this.saltRounds = 10
    }


    async create(user: UserModel): Promise<User> {
        user.password = await this.getHash(user.password);

        const result = await this.userRepository.save(
            this.userRepository.create(user),
        );

        delete result.password;
        return result;
    }

    async update(id, user: UpdateUserDto): Promise<UpdateResult> {
        return await this.userRepository.update(id, user);
    }

    async findByPhone(mobile: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                mobile,
            },
        });
    }

    async findById(id: number): Promise<UserEntity | null> {
        // return await this.userRepository.findOne({ where: { id: id } });
        return await this.userRepository.findOneOrFail({ where: { id: id } });
    }

    async getHash(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    async compareHash(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    async findByPhoneWithPassword(mobile: string): Promise<User> | null {
        return await this.userRepository.findOne(
            {
                where: { mobile: mobile },
                select: ['id', 'mobile', 'password'],
            },

        );
    }

    async destroy(id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }
}
