const express = require("express");
const router = express.Router();
const recordController = require("../controller/recordController");



router.route("/records").get(recordController.getAll).post(recordController.addRecord);

router.route("/records/:id" ).get(recordController.getRecordById).put(recordController.updateRecordById);


//route for searching by iin
router.get("/search", recordController.searchRecord);

module.exports = router;



