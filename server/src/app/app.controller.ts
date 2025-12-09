import { Controller, Get, HttpCode, Logger, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaService } from 'src/common/prisma.service';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/',
})
export class AppController {
    private readonly logger = new Logger(AppController.name);

    constructor(
        private readonly healthCheckService: HealthCheckService,
        private readonly prismaService: PrismaService,
    ) {}

    @Get('/health')
    @HealthCheck()
    public async getHealth() {
        return this.healthCheckService.check([() => this.prismaService.isHealthy()]);
    }

    @Get('/current-env')
    @HealthCheck()
    public async getCurrentEnv() {
        return process.env.APP_ENV;
    }

    @Get('/ready')
    @HttpCode(200)
    public async getReady() {
        return ApiOkResponse();
    }
}
