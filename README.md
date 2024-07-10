![Example SVG](https://github.com/AnupamAkib/Telescope-LiveTV-backend-NodeJS-Docker/raw/main/System_Flow.svg)

## API Reference

### Register a new user
Using this route, user can create their new account to the system. After registering, a verification link will be sent to user's email. After clicking the link from email & get verified, user can enjoy & watch all the channels

```http
  POST /user/register
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `firstName`      | `string` | **Required**. First name of the user|
| `lastName`      | `string` | **Required**. Last name of the user |
| `username`      | `string` | **Required**. Username for login |
| `password`      | `string` | **Required**. Password for login |
| `emailAddress`      | `string` | **Required**. User email address for verification |
#### Sample request:
```json
{
    "firstName" : "Anupam",
    "lastName" : "Hossain Akib",
    "username" : "anupam.akib",
    "password" : "aha@12354",
    "emailAddress" : "mirakib25@gmail.com"
}
```


### Login to the system
This route is used for entering to the system by login

```http
  POST /user/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Username for login |
| `password`      | `string` | **Required**. Password for login |
#### Sample request:
```json
{
    "username" : "anupam.akib",
    "password" : "aha@12354"
}
```


### Verify the Email Address after registration (call from Email)
This endpoint will be opened from user email inbox. The link will send to user email for verification.

```http
  POST /user/verifyEmail?id=your_user_id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. User MongoDB ID |


### Verify the JWT Token
This route is used for verifying a user's token. It checks if the token is not expired & correct

```http
  POST /user/verifyToken
```

#### Sample request:
```js
headers = {
    "Authorization": "Bearer your_jwt_token_here",
    "Content-Type": "application/json"
}
```


### Get all available channels
This route send all the available channels as response. User need to provide a valid JWT Bearer token in header to access all channels

```http
  GET /tv
```

#### Sample request:
```js
headers = {
    "Authorization": "Bearer your_jwt_token_here",
    "Content-Type": "application/json"
}
```


### Check channel availability
This route check if a channel should be visible to an existing user (provided in token). If user is logged in & email is verified then it will response 'true', otherwise 'false'

```http
  POST /tv/checkAvailability
```

#### Sample request:
```js
headers = {
    "Authorization": "Bearer your_jwt_token_here",
    "Content-Type": "application/json"
}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `channelName`      | `string` | **Required**. Enter a channel name to check it's availability |
#### Sample request:
```json
{
    "channelName" : "SOMOY TV"
}
```


### Update channels
This route is responsible for updating channels. An online scheduler hits this endpoint in every 10 minutes to keep updating available channels in database

```http
  GET /updateChannel
```


### Get all activities within the system
This route send us all the activities that happened in system as response. User need to provide JWT token in header so that system can detect admin role & send response accordingly

```http
  GET /activity/getAll
```

#### Sample request:
```js
headers = {
    "Authorization": "Bearer your_jwt_token_here",
    "Content-Type": "application/json"
}
```
