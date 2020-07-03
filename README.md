# Tech stack

Frontend: React - port `3000`

Backend: Express - port `5000`

Database: MongoDB - `collection name: employees`

Test: Jest

# Setup

## 1. Clone Git repo

```
https://github.com/hminnnn/techhunt.git
```

## 2. Install using Docker or manually

### Docker

Install docker

```
    https://docs.docker.com/get-docker/
```

Build

```
    docker-compose build
```

```
    docker-compose up
```

View from

```
    192.168.99.100:3000
```

### Manually

#### Server

Install dependencies in `server` folder

```
    npm install
```

Run server

```
    npm run dev
```

#### App

Install dependencies in `techhunt-app` folder

```
   yarn install
```

Run app

```
    yarn start
```

View from

```
    localhost:3000
```

# USER STORY

## USER STORY 1: Upload Users (Prioritized)

### Assumptions:

- Empty lines in the file are ignored.
- Does not support concurrent upload. An error is provided if a 2nd upload is initialised while a 1st upload is taking place.
- If there is any error, HTTP 400 is returned with a general error message.
- No progress bar is displayed on frontend during uploading.

## USER STORY 2: Employee Dashboard Feature (Prioritized)

### Assumptions:

- On entry, table displays all employees ordered by id.
- Default search values:
  - `maxSalary = 100000`
  - `minSalary = 0`
  - `sort = id`
- Limit is fixed as 30 no matter the input from params.
- Response includes a maxPage number used for pagination:

```
{
    results: [
        {
            id:e0001,
            name: John,
            login: john,
            salary: 1000.00
        }
    ],
    maxPage: 2
}
```

## USER STORY 3, 4

- Not attempted

## USER STORY 5: UI Localization (Bonus)

### Assumptions:

- Language is detected only by navigator.language

# TESTS

#### Server

Run backend tests in `server` folder

```
npm test
```
