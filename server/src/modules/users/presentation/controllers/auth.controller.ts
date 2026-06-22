import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterAdminUseCase } from '../../application/use-cases/register-admin.use-case';
import { TokenService } from '../../application/ports/token.service.port';
import { LoginDto } from '../dto/login.dto';
import { RegisterAdminDto } from '../dto/register-admin.dto';
import { toAuthUserResponse } from '../mappers/auth-response.mapper';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerAdminUseCase: RegisterAdminUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly tokenService: TokenService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterAdminDto) {
    try {
      const user = await this.registerAdminUseCase.execute(dto);
      const token = this.tokenService.sign({
        userId: user.id!,
        email: user.email,
      });

      return {
        token,
        user: toAuthUserResponse(user),
      };
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('invitación') ||
          error.message.includes('correo')
        ) {
          throw new UnprocessableEntityException(error.message);
        }
      }
      throw error;
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      const user = await this.loginUseCase.execute(dto);
      const token = this.tokenService.sign({
        userId: user.id!,
        email: user.email,
      });

      return {
        token,
        user: toAuthUserResponse(user),
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Credenciales inválidas') {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
