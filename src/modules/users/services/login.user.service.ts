import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../entities/dtos/login-user.dto';
import { UserRepository } from '../infra/repositories/user.repository';


@Injectable()
export class LoginUserService {
  constructor(private userRepository: UserRepository,
    @Inject() private jwtService: JwtService

  ) {
  }

  public async execute(data: LoginUserDto): Promise<{ token: string }> {

    const user = await this.userRepository.findByUserByCpf(data.cpf);

    if (!user) {
      throw new NotFoundException('Usuario não encontrado')
    }
    const hashedPassword = user.user.password as string

    if (await this.decryptPassword(data.password, hashedPassword)) {
      const payload = {id: user.id, nome: user.user.name, role: user.user.role }
      return {
        token: await this.jwtService.signAsync(payload)
      }
    }
    else {
      throw new UnauthorizedException('usuario ou senha inválido')
    }

  }

  private async decryptPassword(password: string, hashPassword: string): Promise<boolean> {
    const hash = await bcrypt.compare(password, hashPassword)
    return hash;
  }

}