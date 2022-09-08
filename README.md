## Endpoints

- Auth
  - `POST /auth/signup`  
  - `POST /auth/login`
  - `POST /auth/token`
  
- Restaurants 
  - `POST /restaurants`: Creates new restaurant
  - `GET /restaurants`: List all restaurants
  - `DELETE /restaurants/:id`: Deletes specific restaurant
  - `POST /restaurants/:id`: Details of restaurants with all dishes offered
  - `POST /restuarants/:id/add-dish`: Add new dish for a restaurant
  - `GET /restaurants/:id/orders`: Get all orders of a restaurant, should be able to filter by passing `?status=pending` etc.
  - `GET /restaurants/:id/revenue?start_date=2022-09-08`: Get revenue of a restaurant for given time range. `end_date` default would be `today`'s date
  
- Orders
  - `POST /orders`: Create new order
  - `GET /orders/:id`: Get details of any order
  - `POST /orders/:id/update`: Change status of any order

## Tech Stack and Notes
- ExpressJS
- MongoDB
- Dotenv
- JSONWebToken

### For testing
- Morgan
- Nodemon
- Postman for API testing, additional points if you can share the postman collection as well.
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/b46136bcdb92fcd364c8?action=collection%2Fimport)