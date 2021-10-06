// load up the express framework
const express = require("express");
// create an instance of express to serve our end points
const app = express();
const cors = require("cors");
const port = 3005;
const filePath = "../activities.json";
app.use(cors());

// app.get("/", (req, res) => res.send("Hi there!"));

// READ
/**
 * require(filePath)
 *
 * Usage: reading configuration data
 * it's caches result
 */
// pass the file path to the require function, which return a JSON data as a javascript object
const data = require(filePath);
app.get("/", (req, res) => {
  res.send(data);
});

// =============================================================================================

/**
 * fs.readFile
 *
 * Usage: read current state of file
 * it return the string content of the file, need to parse the data into javascript object
 */
const filePath2 = "./activities.json";

const fs = require("fs"); // require the fs module

// argument: file path, encoding of the file, callback function
// it's asynchronous function which takesan error as its first argument, and the data from the file as the second argument
fs.readFile(filePath2, "utf-8", (err, jsonString) => {
  if (err) {
    // handle error
    console.log(err);
  } else {
    // parse this JSON string into a javascript object
    // JSON.parse is a asynchronous function, and if it encounters an error,
    // it'll throw an error, which will not caught, can crash the program
    // to make sure we're catching the error properly, we need to wrap this JSON.parse call into a try catch
    try {
      const data = JSON.parse(jsonString);
      //console.log(data.tours);

      // get items from json
      app.get("/tours", (req, res) => {
        res.send(data.tours);
      });

      // get item by given idex
      app.get("/tours/:i", (req, res) => {
        res.send(data.tours[req.params.i]);
      });

      // get item by given tour id
      app.get("/tours/id/:id", (req, res) => {
        const tour = data.tours.find(
          (tour) => tour.id === parseInt(req.params.id)
        );
        if (!tour) {
          res.status(404).send("the given id was not found");
        } else {
          res.send(tour);
        }
      });

      // get items under the budget
      app.get("/tours/search/:price", (req, res) => {
        const searchTours = data.tours.filter(
          (tour) => parseInt(tour.price) < parseInt(req.params.price)
        );
        if (!searchTours) {
          res.status(404).send("the given budget was not found");
        } else {
          res.send(searchTours);
        }
      });
    } catch (err) {
      console.log("Error parsing JSON: ", err);
    }
  }
});
// =============================================================================================
/**
 * fs.readFileSync
 * synchronous version of readfile
 *
 * instead of taking a callback, fs.readFileSync returns the data from the data to us directly
 * because it is a synchronous operation which will throw if it encounters an error
 * so also need to make sure we wrap this in a try catch block
 * it is a synchronous and blocking function, which can slow down the application
 * when reading files, it's recommended to use asynchronous readfile method
 */
// try {
//   const jsonString = fs.readFileSync(filePath2, "utf-8");
//   const data = JSON.parse(jsonString);
//   console.log(data);
// } catch {
//   console.log(err);
// }
// =============================================================================================
// WRITE
// const newObj = {
//   id: 1111,
//   title: "Skip the Line: TV Tower Early Bird Tickets",
//   price: "140",
//   currency: "$",
//   rating: "4.5",
//   isSpecialOffer: false,
// };
// fs.writeFile("./NEWactivities.json", JSON.stringify(newObj), (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("file successfully written!");
//   }
// });

// finally, launch our server on port 3005
app.listen(port, () => console.log(`Demo server listening on port ${port}!`));
