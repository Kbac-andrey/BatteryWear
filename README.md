# BatteryWear
BatteryWear is an application designed to identify schools with the highest number of battery issues. It aims to provide users with an easy and intuitive way to find schools and gather relevant information about the battery wear of their devices.

## Design Explanation
The design of BatteryWear focuses on simplicity and usability, ensuring that users can quickly locate schools with battery issues and access the necessary information. The key design elements and assumptions of the application are as follows:

1. Search Field: The application features a prominent search field where users can enter the academy id of a specific school. This allows users to quickly find the desired school without having to navigate through complex menus or lists.

2. School List: BatteryWear presents users with a list of schools based on their search query. The list displays relevant information about each school. This enables users to scan the results efficiently and select the school they are interested in.

3. Detailed Information: When a user selects a school from the list, BatteryWear provides more detailed information about the battery wear of devices in that particular school. This information may include battery health statistics.

## Assumptions
The design and implementation of BatteryWear are based on the following assumptions:
1. Data Availability: BatteryWear assumes that the necessary data regarding schools and battery wear is available and accessible through API. The application relies on `battery-data.json` file witch store locally.

2. Battery Wear Metrics: BatteryWear assumes that the battery wear of devices can be accurately measured and quantified using relevant metrics. These metrics may include battery health average percent per day. The application utilizes these metrics to evaluate and compare the battery wear of different schools.

3. User Expectations: BatteryWear assumes that users are primarily interested in identifying schools with high battery wear. Therefore, the design focuses on presenting relevant information related to battery wear

It is important to note that these assumptions are made based on the available information and requirements provided for the BatteryWear application. As the development progresses and additional information becomes available, the design and assumptions may evolve to better meet the needs of the users

# Technical note
This project was generated with [Angular CLI](https://github.com/angular/angular-cli). If you want run application you should   Node.js version `12.11.1` or higher you can  download stable version here `https://nodejs.org/en`.

# Development server
Run `ng serve` or use npm command `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

##Running unit tests

Run `ng test` or use npm command `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io) .



