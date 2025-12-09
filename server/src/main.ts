import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import express from 'express';

import { AppModule } from './app/app.module';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    try {
        const app = await NestFactory.create(AppModule, new ExpressAdapter(express()));
        const configService = app.get(ConfigService);

        // Enable cookie parser
        app.use(cookieParser());
        logger.log('✅ Cookie parser enabled');

        // Configure CORS
        const corsOrigin = configService.get<string>('app.corsOrigin') || '*';
        const allowedOrigins = [corsOrigin, 'http://localhost:5173', '*'];
        app.enableCors({
            origin: allowedOrigins,
            methods: 'GET,POST,PUT,DELETE,OPTIONS',
            allowedHeaders: 'Content-Type,Authorization',
            credentials: true,
        });
        logger.log(`✅ CORS enabled with allowed origins: ${allowedOrigins.join(', ')}`);

        // Retrieve configuration values
        const port: number = configService.get<number>('app.http.port', 3000);
        const host: string = configService.get<string>('app.http.host', '0.0.0.0');
        const versioningPrefix: string = configService.get<string>('app.versioning.prefix', 'v');
        const version: string = configService.get<string>('app.versioning.version', '1');
        const versionEnable: boolean = configService.get<boolean>('app.versioning.enable', true);

        // Versioning
        if (versionEnable) {
            app.enableVersioning({
                type: VersioningType.URI,
                defaultVersion: version,
                prefix: versioningPrefix,
            });
            logger.log(
                `✅ API versioning enabled with prefix: ${versioningPrefix}, default version: ${version}`,
            );
        }

        await app.listen(port, host);
        logger.log(
            `🚀 ${configService.get('app.name')} service started successfully on ${host}:${port}`,
        );
    } catch (error) {
        logger.error('❌ Error during application bootstrap', error.stack);
        process.exit(1); // Exit with failure code
    }
}

bootstrap();
