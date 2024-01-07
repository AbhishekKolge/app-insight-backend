# Android apps analytics backend

It is a frontend for AppInsight web application. It is an app where user can register for free and take advantage of free analytics of applications on google play store.

## Demo

link: https://app-insight.vercel.app

## API Reference

https://api.postman.com/collections/17221325-9a6c9b83-0e61-4cf7-9835-c4f6840dbfed?access_key=PMAT-01HKBAHC3CTR8NYNV8V73R25RA

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`FRONT_END_ORIGIN`

`CLOUD_NAME`

`CLOUD_API_KEY`

`CLOUD_API_SECRET`

`JWT_SECRET`

`PORT`

`DATABASE_URL`

`EMAIL_FROM_NAME`

`EMAIL_FROM_ID`

`SENDGRID_HOST`

`SENDGRID_PORT`

`SENDGRID_USER`

`SENDGRID_API_KEY`

`TOKEN_EXPIRATION_TIME`

`TEST_USER_ID`

`APP_NAME`

`NODE_ENV`

## Run Locally

Clone the project

```bash
  git clone https://github.com/AbhishekKolge/app-insight-backend.git
```

Go to the project directory

```bash
  cd app-insight-backend
```

Install dependencies with NPM

```bash
  npm install
```

Migrate Prisma Schema to connected database

```bash
  npx prisma migrate dev --name init
```

Seed data (This command will seed the data from CSV file to connected database)

```bash
  npm run seed
```

Start the server

```bash
  npm run dev
```
