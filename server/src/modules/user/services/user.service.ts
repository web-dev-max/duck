import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SmsService } from 'src/modules/sms/services/sms.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private smsService: SmsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.$transaction(async (tx) => {
      try {
        const user = await tx.user.create({
          data: {
            name: createUserDto.name,
            email: createUserDto.email,
            phone: createUserDto.phone,
            paid: createUserDto.paid ?? false,
            ducks: createUserDto.ducks,
          },
        });

        if (createUserDto.ducks > 0) {
          const duckPromises = Array.from({ length: createUserDto.ducks }, () =>
            tx.duck.create({
              data: {
                userId: user.id,
              },
            }),
          );
          await Promise.all(duckPromises);
        }

        return user;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ConflictException('Вы уже прошли регистрацию');
          }
        }
        throw error;
      }
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

  async handlePaymentSuccess(userId: string) {
    const user = await this.findOne(userId);
    if (!user) throw new Error('Пользователь не найден');

    // Генерируем случайный проверочный код
    const verificationCode = Math.floor(Math.random() * 8999 + 1000).toString(); // Четырехзначный код

    // Отправляем SMS с кодом
    await this.smsService.sendVerificationCode(user.phone, verificationCode);

    await this.prisma.user.update({
      where: { id: userId },
      data: { verificationCode },
    });

    return { success: true };
  }
}