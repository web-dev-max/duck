import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.$transaction(async (tx) => {
      let user: User | null;

      user = await tx.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (user) {
        if (user.paid) {
          throw new ConflictException('Вы уже прошли регистрацию');
        }

        user = await tx.user.update({
          where: { id: user.id },
          data: {
            name: createUserDto.name,
            phone: createUserDto.phone,
            ducks: createUserDto.ducks,
            verificationCode: createUserDto.verificationCode,
            paid: createUserDto.paid ?? false,
          },
        });

        await tx.duck.deleteMany({
          where: { userId: user.id },
        });
      } else {
        user = await tx.user.create({
          data: {
            name: createUserDto.name,
            email: createUserDto.email,
            phone: createUserDto.phone,
            paid: createUserDto.paid ?? false,
            ducks: createUserDto.ducks,
            verificationCode: createUserDto.verificationCode,
          },
        });
      }

      if (createUserDto.ducks > 0) {
        const duckPromises = Array.from({ length: createUserDto.ducks }, () =>
          tx.duck.create({
            data: {
              userId: user!.id,
            },
          }),
        );
        await Promise.all(duckPromises);
      }

      const duckAssignments = await tx.duck.findMany({
        where: { userId: user.id },
        select: { id: true },
        orderBy: { id: 'asc' },
      });

      const duckNumbers = duckAssignments.map(d => d.id).join(', ');

      return {
        ...user,
        duckNumbers,
        totalDucks: duckAssignments.length,
      };
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getAdminView() {
    const users = await this.prisma.user.findMany({
      include: {
        duckAssignments: {
          select: { id: true },
          orderBy: { id: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => ({
      ...user,
      duckNumbers: user.duckAssignments.map(d => d.id).join(', '),
      totalDucks: user.duckAssignments.length,
    }));
  }
}