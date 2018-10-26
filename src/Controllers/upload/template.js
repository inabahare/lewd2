import express                     from "express";
import crypto                      from "crypto";
import escape                      from "../Functions/Upload/escape";
import multer                      from "multer";
import dnode                       from "dnode";
import fs                          from "fs";
import { promisify }               from "util";
import getUploaderOrDefault        from "../../Functions/Upload/getUploaderOrDefault";
import getImageFilenameIfExists    from "../../Functions/Upload/getImageFilenameIfExists";
import addImageToDatabase          from "../../Functions/Upload/addImageToDatabase";
import updateExistingFile          from "../../Functions/Upload/updateExistingFile";
import generateDeletionKey         from "../../Functions/Upload/deletionKey";
import hashFile                    from "../../Functions/Upload/hashFile";
import symlink                     from "../../Functions/Upload/symlink";


function get(req, res) {

}

function post(req, res) {

}

const validate = [

]

export { get, post, validate }