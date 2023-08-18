const express = require("express");

const cors = require("cors");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const routes = require("./routes/recordroutes");

const port = process.env.NODE_ENV ==='production' ? process.env.PROD_APP_PORT : process.env.APP_PORT;
const host = process.env.NODE_ENV ==='production' ? process.env.PROD_APP_HOST : process.env.APP_HOST;


const app = express();
app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));


app.use("/", routes);




app.listen(port,host, () => {
  console.log(`Server is running on  ${host}:${port}`);
});
