# hosing-app

## Overview

Two types of users owner & buyer, the users can add and search the property with the filters like within radius of n kms, lat long, country, city. User can mark any property as favourite and can see the list of the favourite properties.

User authentication is done through JWT. User needs to be authenticated for adding the property and for marking any property favourite.

When the property is added in db, the id of newly created property along with its lat & long is added in redis using GEOADD command.
For searching the property the within a given radius, through zrange checking in redis if the nearby property ids are cached or not. If ids are found in redis, then making a DB call to fetch the details of the cached ids and returning the result to the user.
If cached data is not found in redis then through GEOSEARCH command get the nearby property ids and then store it in redis using the zadd command. Then making a DB call to fetch the detials of the cached ids and returning the result to the user. 
Considering if the traffic is high on the server can put the TTL of 10 mins for the data stored in the redis.

Favourite properties are saved in the user collection itself. For avoiding the scan of favorites collection for each user while fetching the list.

## Running The Project

To get started, here's a list of recommended next steps:

1. clone the project from ''
2. Install dependencies
3. cd housing-app
4. Run Mongo and Redis server
5. npm install
6. create a .env file in the root folder
7. Paste the key values from the sample.env file
8. npm run start


## Dependencies
Node.js
mongoose
Redis
Typescript
Express


## To Do
writing test cases

## curl Requests

1. Create User:

curl --location --request POST 'http://localhost:8000/api/v1/user' \
--header 'Content-Type: application/json' \
--data-raw '{
    "first_name": "Parinita",
    "last_name": "Mehta",
    "user_type":"OWNER",
    "email": "pups123@gmail.com",
    "password": "pari",
    "phone_number": "XXXXXXXXXX"
}'

2. Authenticate user:

curl --location --request POST 'http://localhost:8000/api/v1/user' \
--header 'Content-Type: application/json' \
--data-raw '{
    "first_name": "Pari",
    "last_name": "Mehta",
    "user_type":"OWNER",
    "email": "pups123@gmail.com",
    "password": "pari",
    "phone_number": "8859213251"
}'

#. Add property:

curl --location --request POST 'http://localhost:8000/api/v1/Property' \
--header 'token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzSW4iOiIyNGgiLCJkYXRhIjp7ImZpcnN0X25hbWUiOiJQYXJpIiwibGFzdF9uYW1lIjoiTWVodGEiLCJlbWFpbCI6InBhcmkxMjNAZ21haWwuY29tIn0sImlhdCI6MTYzNzM5NDQ3MX0.b09qGga6N8_CAE8nJc-MrSgHwE4Ax7luWXc1GIoOPik' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Paras Tiera",
    "description": "1 BHK Appartment for rent",
    "property_type": "Own",
    "room_type": "SINGLE",
    "accommodates": 2,
    "bedrooms": 1,
    "beds": 1,
    "bed_type": "DOUBLE",
    "bathrooms": 1,
    "price": 10000,
    "security_deposit": 20000,
    "amenities": [
        "Kitchen",
        "Wifi",
        "Gyser",
        "TV",
        "Fridge"
    ],
    "images": [
        {
            "thumnail_url": "",
            "picture_url": ""
        }
    ],
    "address": {
        "street": "Sector 81",
        "government_area": "Noida Special Economic zone",
        "city": "Barola",
        "pincode": 201305,
        "country": "India",
        "country_code": "IN",
        "location": {
            "type": "point",
            "lat": 28.5414,
            "long": 77.3970
        }
    },
    "age": "1 years",
    "added_by": "6197dec65fde425d8e2a1a48",
    "available_from": "01/12/2022"
}
'

Search Property:

curl --location --request GET 'http://localhost:8000/api/v1/property?radius=10&lat=28.54141&long=77.3970&limit=1&page=1&searchType=RADIUSLATLANG'


Wishlist Property:

curl --location --request POST 'http://localhost:8000/api/v1/property/wishlist' \
--header 'token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzSW4iOiIyNGgiLCJkYXRhIjp7ImZpcnN0X25hbWUiOiJQYXJpIiwibGFzdF9uYW1lIjoiTWVodGEiLCJ1c2VyX2lkIjoiNjE5YTgzOWFkMjNmY2E2YTU5YjJmYWQ3IiwiZW1haWwiOiJwdXBzMTIzQGdtYWlsLmNvbSJ9LCJpYXQiOjE2Mzc1MTcxMjR9.yWLPgVAOol71Og7lUKSUp2zLHMrPe-cs5Amv1IcuZ5M' \
--header 'Content-Type: application/json' \
--data-raw '{
    "property_id": "6199cacdd72667c77b6385d6",
    "price": 10000,
    "name": "name",
    "description": "1 BHK Appartment for rent"

}'

Get Wishlisted property:

curl --location --request GET 'http://localhost:8000/api/v1/property/wishlist' \
--header 'token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzSW4iOiIyNGgiLCJkYXRhIjp7ImZpcnN0X25hbWUiOiJQYXJpIiwibGFzdF9uYW1lIjoiTWVodGEiLCJ1c2VyX2lkIjoiNjE5YTgzOWFkMjNmY2E2YTU5YjJmYWQ3IiwiZW1haWwiOiJwdXBzMTIzQGdtYWlsLmNvbSJ9LCJpYXQiOjE2Mzc1MTcxMjR9.yWLPgVAOol71Og7lUKSUp2zLHMrPe-cs5Amv1IcuZ5M'