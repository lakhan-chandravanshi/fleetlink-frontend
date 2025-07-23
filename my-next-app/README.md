# fleetlink-frontend

# fleetlink-frontend

🚀 Features
✅ Add a vehicle (POST to backend)

✅ Search for vehicles by:

Required capacity

From/To pincode

Start date/time

✅ Display only available vehicles

✅ Book vehicle (POST booking request)

✅ Loading states, basic error handling

Step 1: Clone and Install
cd fleetlink-frontend
npm install

Step 2: Set API Base URL
In lib/api.js

// lib/api.js
const api = axios.create({
  baseURL: "http://localhost:5000", // Change to backend URL
});


Step 3: Run Dev Server

npm run dev


| Route          | Description                 |
| -------------- | --------------------------- |
| `/add-vehicle` | Add a new logistics vehicle |
| `/search-book` | Search & book a vehicle     |


