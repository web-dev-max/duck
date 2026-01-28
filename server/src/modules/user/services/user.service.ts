import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
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

      const requestedDucks = createUserDto.ducks;

      if (requestedDucks > 0) {
        const totalUsed = await tx.duck.count();
        const MAX_DUCKS = 9999;

        if (totalUsed + requestedDucks > MAX_DUCKS) {
          throw new BadRequestException(
            `Недостаточно доступных номеров уток. Осталось: ${MAX_DUCKS - totalUsed}`
          );
        }

        const usedNumbers = await tx.duck.findMany({
          select: { number: true },
        });
        const usedSet = new Set(usedNumbers.map(d => d.number));

        const availableNumbers: number[] = [];
        for (let i = 1; i <= MAX_DUCKS; i++) {
          if (!usedSet.has(i)) {
            availableNumbers.push(i);
          }
        }

        const shuffled = availableNumbers
          .sort(() => 0.5 - Math.random())
          .slice(0, requestedDucks);

        if (shuffled.length < requestedDucks) {
          throw new BadRequestException('Недостаточно свободных номеров (внутренняя ошибка)');
        }

        await Promise.all(
          shuffled.map(number =>
            tx.duck.create({
              data: {
                userId: user!.id,
                number,
              },
            })
          )
        );
      }

      const duckAssignments = await tx.duck.findMany({
        where: { userId: user.id },
        select: { number: true },
        orderBy: { number: 'asc' },
      });

      const duckNumbers = duckAssignments.map(d => d.number).join(', ');

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
          select: { number: true },
          orderBy: { number: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => ({
      ...user,
      duckNumbers: user.duckAssignments.map(d => d.number).join(', '),
      totalDucks: user.duckAssignments.length,
    }));
  }
}