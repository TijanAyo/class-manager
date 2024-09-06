import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserRepositoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail() {}
}
