import { db }                          from "../helpers/database";
import moment                      from "moment";
import { check, validationResult } from "express-validator/check";

// function get(req, res) {

// }

function post(req, res) {
    console.log(req.body);
}

const validate = [

];

export { post, validate };