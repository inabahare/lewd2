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

Date: 2018-06-27 01:34:43
*/


-- ----------------------------
-- Table structure for Users
-- ----------------------------
DROP TABLE IF EXISTS "public"."Users";
CREATE TABLE "public"."Users" (
"id" serial4 NOT NULL,
"username" varchar(255) COLLATE "default",
"password" varchar(255) COLLATE "default",
"token" varchar(255) COLLATE "default",
"roleid" int2
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of Users
-- ----------------------------
INSERT INTO "public"."Users" (username, password, token, roleid) VALUES ('username here', 'password here', 'testtoken', '3');

-- ----------------------------
-- Alter Sequences Owned By 
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table Users
-- ----------------------------
ALTER TABLE "public"."Users" ADD PRIMARY KEY ("id");
