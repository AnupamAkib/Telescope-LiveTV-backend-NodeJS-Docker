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

#### Sample expected response:
```json
{
    "message": "success",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6IkFudXBhbSBIb3NzYWluIEFraWIiLCJ1c2VybmFtZ5I6ImFudXBhbS5ha2liIiwiZW1haWxBZGRyZXNzIjoiYW51cGFtMzUtMjY0MEBkaXUuZWR1LmJkIiwiaWF0IjoxNzIwNjM0NDg0LCJleHAiOjE3MzYxODY0ODR9.493_2xu4Jjc6oZ5AqTDnut_sxgk7SKxbf-l-N2W1DTg",
    "user": {
        "firstName": "Anupam",
        "lastName": "Hossain Akib",
        "username": "anupam.akib",
        "password": "ba2f16959dd34bbbd658dd84a429bd66",
        "emailAddress": "mirakib25@gmail.com",
        "isEmailVerified": false,
        "_id": "668ecc739930d736446abbac",
        "createdAt": "2024-07-10T18:01:24.025Z",
        "updatedAt": "2024-07-10T18:01:24.025Z",
        "__v": 0,
        "fullName": "Anupam Hossain Akib",
        "id": "668ecc739930d736446abbcc"
    }
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
#### Sample expected response:
```json
{
    "message": "success",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6IlRhaGF6emF0IEFuenUALCJ1c2VybmFtZSI6ImFuenUiLCJlbWFpbEFkZHJlc3MiOiJhbnp1bWlyLmR1QGdtYWlsLmNvbSIsImlhdCI6MTcyMDYzNDcyNywiZXhwIjoxNzM2MTg2NzI3fQ.nSfpe_jmv4ranBM7rSZHj5LHWnf419-I8kdYsNNxV8A",
    "user": {
        "_id": "66783dd5adedab9ed5edb46f",
        "firstName": "Anupam",
        "lastName": "Hossain Akib",
        "username": "anupam.akib",
        "password": "00498a41d4eaed57752dd6b2d991a96e",
        "emailAddress": "mirakib25@gmail.com",
        "isEmailVerified": true,
        "createdAt": "2024-06-23T15:23:01.870Z",
        "updatedAt": "2024-06-23T15:28:46.508Z",
        "__v": 0,
        "fullName": "Anupam Hossain Akib",
        "id": "66783dd5adedab9ed5edb46f"
    }
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
#### Sample expected response:
```json
{
    "message": "success"
}
```


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
#### Sample expected response:
```json
{
    "message": "success",
    "username": "anupam.akib",
    "fullName": "Anupam Hossain Akib"
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
#### Sample expected response:
```js
[
    {
        "message": "success",
        "channelCount": 56,
        "user": {
            "fullName": "Anupam Hossain Akib",
            "username": "anupam.akib",
            "emailAddress": "mirakib25@gmail.com",
            "isEmailVerified": true
        },
        "videos": [
            {
                "_id": "666c977a14c0f76ce8b3a8f8",
                "channelName": "Independent Television",
                "url": "https://www.youtube.com/embed/urczBBUS_RQ",
                "channelLogo": "https://localhost:3000/independent.jpg",
                "country": "BD",
                "broker": "API4",
                "priority": 3,
                "lastUpdate": 1720635004787,
                "lastUpdateTimeDate": "11 July, 2024 | 12:10 AM",
                "__v": 0
            },
            {
                "_id": "666c977b14c0f76ce8b3a8fe",
                "channelName": "Channel i News",
                "url": "https://www.youtube.com/embed/8tvpdpYqSwg",
                "channelLogo": "https://localhost:3000/channel_i.jpg",
                "country": "BD",
                "broker": "API4",
                "priority": 15,
                "lastUpdate": 1720635005002,
                "lastUpdateTimeDate": "11 July, 2024 | 12:10 AM",
                "__v": 0
            },
            //other 54 more channels
        ]
    }
]
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
##### In JSON body request:
```json
{
    "channelName" : "SOMOY TV"
}
```
#### Sample expected response:
```json
{
    "message": "success"
}
```


### Update channels
This route is responsible for updating channels. An online scheduler hits this endpoint in every 10 minutes to keep updating available channels in database. It also deletes those channels from database that didn't found in last 24 hours.

```http
  GET /updateChannel
```
#### Sample expected response:
```json
{
    "message": "success",
    "status": {
        "newChannelAddedCnt": 12,
        "updatedChannelCnt": 24,
        "deletedChannelCnt": 3
    }
}
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
#### Sample expected response:
```js
{
    "message": "success",
    "user": "ALL",
    "allUser": [
        "anupam.akib",
        "test.user"
    ],
    "topActivities": [
        {
            "_id": "668ed04b6c001124ef6e40d8",
            "username": "anupam.akib",
            "fullName": "Anupam Hossain Akib",
            "activity": "watched 'SOMOY TV'",
            "timeDate": "12:17 AM | 11 July, 2024",
            "__v": 0
        },
        {
            "_id": "668ecd676c001124ef6e406d",
            "username": "anupam.akib",
            "fullName": "Anupam Hossain Akib",
            "activity": "logged in to the system",
            "timeDate": "12:05 AM | 11 July, 2024",
            "__v": 0
        },
        //other activities
    ]
}
```






## 🛠 Skills
Node.js, Express.js, MongoDB, Javascript, JWT Authentication, MVC Architecture, Docker, Web Scraping

## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://anupam-akib.netlify.app/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/anupamakib/)


## Authors

- [@AnupamAkib](https://github.com/AnupamAkib/)
