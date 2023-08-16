const express = require("express");
const db = require("./db");
const cors = require("cors");
const path = require("path");
const qrcode = require("qrcode");

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.APP_PORT;
const host = process.env.APP_HOST;

const front_host = process.env.FRONT_HOST;
const front_port = process.env.FRONT_PORT;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

const options = {
    errorCorrectionLevel: 'H', // High error correction level
    type: 'image/png', // Image type (other supported types: svg, jpeg)
    quality: 0.92, // Image quality for jpeg and webp formats (0 to 1)
    margin: 1, // QR code margin (number of modules)
  };

app.get("/records", (req, res) => {
  db.defaults.query("SELECT * FROM records", (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });
});


app.get("/records/:id", (req, res) => {
  const { id } = req.params;
  db.defaults.query(`SELECT * FROM records WHERE id = ${id}`, (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });
});


//route for searching by iin
app.get("/search", (req, res) => {
  const { iin,serialNumber,number } = req.query;
  // console.log(iin,serialNumber,number)
  db.defaults.query(`SELECT * FROM records WHERE iin = ${iin} and serial_number = ${serialNumber}
  and diplom_number = ${number}`, (err, rows) => {
    if (err) throw err;
    if(rows.length == 0){
      return res.send("Not found");
    }
    res.send(rows);
  });
});


//id, fullname, iin, birthday, organ-title, studying-period, type, serial-number, number
app.post("/add", (req, res) => {
  const { fullname, iin, birthday, organ_title,studying_period,type,serialNumber,number,lang } = req.body;
  const sql = `INSERT INTO records ( fullname, iin, birthday, organ_title, studying_period, study_type, serial_number, diplom_number)
   VALUES ('${fullname}', '${iin}', '${birthday}', '${organ_title}', '${studying_period}', '${type}', '${serialNumber}', '${number}');`;
  db.defaults.query(sql, (err, result) => {
    if (err) throw err;
    const id = result.insertId;
    const link = `http://${front_host}:${front_port}/records?id=${id}&lang=${lang}`;
    qrcode.toFile(`./images/${id}.png`, link, options);
    res.json(`http://${host}:${port}/images/${id}.png`)
  });
});



app.listen(port,host, () => {
  console.log(`Server is running on  ${host}:${port}`);
});
