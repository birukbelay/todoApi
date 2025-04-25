  
# setting up the project
>
> you can use 2 ways to setup this project

1. with local instalation
2. docker setup

- this project is dependent cloudinary for file upload & mongodb for database, you have d/t options as below for the database but to use image upload feature you will need to create a cloudinary account

## 1. local instalation

- clone the project and add a .env file and you can copy values from .env.example file and configure the following

### database setup

> if you are using locally installed mongodb with out authentication you will only need to worry about the first 3 variables
>
MONGO_DATABASE_NAME='todo-dev' //you can choose any values for this
IS_MONGO_REMOTE='false'
MONGO_HOSTNAME=127.0.0.1:27017

> if you are using atlas or local setup with auth fill all mongodb related fields and set `IS_MONGO_REMOTE='true'`

### File upload

- i am using interface for file upload, it can be substiuted for any provider like firebase, localdisk upload, s3 ...
- for this project i am using cloudinary so you will need to setup those credentials

# docker setup

to run the backend with docker you just have to create a .env.docker file and specify values
you can copy them form .env.example, but you must change the host name and set
MONGO_HOSTNAME=mongo:27017
IS_MONGO_REMOTE='false'

the rest could be same as the .env.example
and you can run `docker compose up`

## authentication code

to access the app you will need to signup with an email, and for this demo
-- the verification code is `0000` on signup, it has been set statically, via an interface function that mimics sending otps.

example:

- "phoneOrEmail": "<a@b.co>",
- "code": "0000"
