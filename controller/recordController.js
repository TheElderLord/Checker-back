const db = require('../db');
const qrcode = require("qrcode");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const front_host = process.env.NODE_ENV ==='production' ? process.env.PROD_FRONT_HOST : process.env.FRONT_HOST;
const front_port = process.env.NODE_ENV ==='production' ? process.env.PROD_FRONT_PORT : process.env.FRONT_PORT;

const port = process.env.NODE_ENV ==='production' ? process.env.PROD_APP_PORT : process.env.APP_PORT;
const host = process.env.NODE_ENV ==='production' ? process.env.PROD_APP_HOST : process.env.APP_HOST;



const options = {
    errorCorrectionLevel: 'H', // High error correction level
    type: 'image/png', // Image type (other supported types: svg, jpeg)
    quality: 0.92, // Image quality for jpeg and webp formats (0 to 1)
    margin: 1, // QR code margin (number of modules)
  };



   exports.searchRecord = (req, res) => {
    const { iin,serialNumber,number } = req.query;
    // console.log(iin,serialNumber,number)
    db.defaults.query(`SELECT * FROM records WHERE iin = ${iin} and serial_number = ${serialNumber}
    and diplom_number = ${number}`, (err, rows) => {
      if (err) console.log(err);
      if(rows.length == 0){
        return res.send("Not found");
      }
      res.send(rows);
    });
  };


//id, fullname, iin, birthday, organ-title, studying-period, type, serial-number, number
exports.addRecord = (req, res) => {
    const { fullname, iin, birthday, organ_title,studying_period,type,serialNumber,number,lang } = req.body;
    const sql = `INSERT INTO records ( fullname, iin, birthday, organ_title, studying_period, study_type, serial_number, diplom_number)
     VALUES ('${fullname}', '${iin}', '${birthday}', '${organ_title}', '${studying_period}', '${type}', '${serialNumber}', '${number}');`;
    db.defaults.query(sql, (err, result) => {
      if (err) console.log(err);
      const id = result.insertId;
      console.log(lang);
      const outputPath = path.join(__dirname, '..', 'images', `${id}.png`);

      const link = `http://${front_host}:${front_port}/records?id=${id}&lang=${lang}`;

      qrcode.toFile(outputPath, link, options);
      res.json(`http://${host}:${port}/images/${id}.png`)
    });
  };

  exports.getAll = (req, res) => {
    db.defaults.query("SELECT * FROM records", (err, rows) => {
      if (err) console.log(err);
      res.send(rows);
    });
  };



  exports.getRecordById = (req, res) => {
    const { id } = req.params;
    db.defaults.query(`SELECT * FROM records WHERE id = ${id}`, (err, rows) => {
      if (err) console.log(err);
      res.send(rows);
    });
  };

  exports.updateRecordById = (req, res) => {
    const { id } = req.params;
    const { fullname, iin, birthday, organ_title,studying_period,type,serialNumber,number } = req.body;
    const sql = `UPDATE records SET fullname = '${fullname}', iin = '${iin}', birthday = '${birthday}', organ_title = '${organ_title}', studying_period = '${studying_period}', study_type = '${type}', serial_number = '${serialNumber}', diplom_number = '${number}' WHERE id = ${id}`;
    db.defaults.query(sql, (err, result) => {
      if (err) console.log(err);
      res.send("Record updated...");
    });
  };
  exports.deleteRecordById = (req,res) =>{
    const {id} = req.params;
    const sql = `Delete from records where id = ${id}`;
    db.defaults.query(sql,(err,result)=>{
      if(err){
        throw err;
      }
      db.defaults.query("SELECT * FROM records", (err, rows) => {
        if (err) console.log(err);
        res.json(rows);
      });
      
    })
  }