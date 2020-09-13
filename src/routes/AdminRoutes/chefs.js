const express = require('express');
const routes = express.Router();

const multer = require('../../app/middlewares/multer');
const { onlyAdmins } = require('../../app/middlewares/session');

const ChefsController = require("../../app/controllers/admin/ChefsController");

routes.get("/", ChefsController.index);
routes.get("/create", onlyAdmins, ChefsController.create);
routes.get("/:id", ChefsController.show);
routes.get("/:id/edit", onlyAdmins, ChefsController.edit);

routes.post("/", multer.array("photos", 1), ChefsController.post);
routes.put("/", multer.array("photos", 1), ChefsController.put);
routes.delete("/", onlyAdmins, ChefsController.delete);

module.exports = routes;