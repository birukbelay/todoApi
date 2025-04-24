  
# setting up the project
  
## instalation

- clone the project and add a .env file
- the project uses cloudinary for file upload & mongodb for database so you need to setup those

  ### mongodb

  - if you are using local setup you will need only the first 2 variables, MONGO_USER_NAME, & IS_MONGO_REMOTE

> set is mongoRemote to "false" to use the local mongodb with out authentication
IS_MONGO_REMOTE='false'
MONGO_USER_NAME='user1'
> if you are using atlas or local setup with auth fill the below fields, and set `IS_MONGO_REMOTE='true'`
MONGO_PASSWORD='randum pwd'
MONGO_DATABASE_NAME='db1'
MONGO_HOSTNAME='somehost.xxxxx.mongodb.net'

### File upload

- i am using interface for file upload, it can be substiuted for any provider like firebase, localdisk upload, s3 ...
- for this project i am using cloudinary so you will need to setup those credentials

## authentication code

-- the verification code is 0000 on signup, it has been set statically, via an interface function that mimics sending otps.

example:

- "phoneOrEmail": "<a@b.co>",
- "code": "0000"
