http://access.engr.oregonstate.edu:4044/

### Setup
From the directory, install all npm modules with the following command:
```
npm install
```

### Run
First, make sure you are connected to the OSU wifi by either being on campus or connected via VPN.
Next, run the server and connect to the database with the following command:
```
npm start
```

## IMPORTANT NOTE
Running the server on the website link with the forever package causes issues with adding recipes and potential server crashes. If error encountered, reset the phpmyadmin database by deleting the information on the database and readding with the db.sql file.
```
username: cs340_trotterj
password: 9288
```
