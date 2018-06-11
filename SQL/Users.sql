/*
Navicat PGSQL Data Transfer

Source Server         : LocalPostgres
Source Server Version : 100400
Source Host           : localhost:5432
Source Database       : lewd
Source Schema         : public

Target Server Type    : PGSQL
Target Server Version : 100400
File Encoding         : 65001

Date: 2018-06-10 20:32:31
*/


-- ----------------------------
-- Table structure for Users
-- ----------------------------
DROP TABLE IF EXISTS "public"."Users";
CREATE TABLE "public"."Users" (
"id" int4 DEFAULT nextval('"Users_id_seq"'::regclass) NOT NULL,
"username" varchar(255) COLLATE "default",
"password" varchar(255) COLLATE "default",
"role" varchar(255) COLLATE "default",
"token" varchar(255) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Alter Sequences Owned By 
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table Users
-- ----------------------------
ALTER TABLE "public"."Users" ADD PRIMARY KEY ("id");
