import { NotFoundExceptionHandler } from 'src/shared/errors/NotFoundExpetion';
import { AdminRepository } from './admin.repository';
import { LoginAdminDto } from './dtos/loginAdmin.dto';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService{
  constructor (private adminRepository:AdminRepository,
        @Inject() private jwtService: JwtService,
        private configService:ConfigService
  ) {
  }
  async login(loginAdminDto:LoginAdminDto):Promise<{token:string}>{
    const admin = await this.adminRepository.findAdminByLogin(loginAdminDto.login)

    if(!admin){
      throw new UnauthorizedException('Verifique o login e a senha informada e tente novamente')
    }
    

    const passwordIsCorrect = admin.password === loginAdminDto.password 

    if(!passwordIsCorrect){
      throw new UnauthorizedException('Verifique o login e a senha informada e tente novamente')
    }

    const payload = {
      name:admin.name, role: admin.role, 
    }
    return {
      token: await this.jwtService.signAsync(payload),
    }
  }
}