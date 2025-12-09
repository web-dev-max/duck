- [Auth Submodule Service](#auth-submodule-service)
  - [Installation](#installation)
  - [Running the app](#running-the-app)
  - [Database](#database)
  - [Test](#test)
  - [License](#license)
- [Использование паролей при локальном запуске](#использование-паролей-при-локальном-запуске)


# Auth Submodule Service

[Nest](https://github.com/nestjs/nest) Microservice framework auth service TypeScript repository.

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn dev

# production mode
$ yarn start
```

## Database

```bash
# generate schema
$ yarn generate

# migrate dev
$ yarn migrate

# migrate prod
$ yarn migrate:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```


# Использование паролей при локальном запуске  

+ Создать файл `.env.passwords` (файл должен быть в `.gitignore` и не храниться в Git репозитории)
+ Переменные, содержащие пароли, добавить в файл `.env.passwords`:  
  ```shell
  SMTP_PASSWORD="my_smtp_password"
  ```
+ При запуске сервиса через Docker указать `.env.passwords`, как дополнительный файл с переменными  
