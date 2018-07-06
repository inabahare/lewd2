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

Date: 2018-06-27 21:09:46
*/


-- ----------------------------
-- Table structure for Roles
-- ----------------------------
DROP TABLE IF EXISTS "public"."Roles";
CREATE TABLE "public"."Roles" (
"id" int4 NOT NULL,
"name" varchar(255) COLLATE "default",
"uploadsize" int8 DEFAULT 134200000
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of Roles
-- ----------------------------
INSERT INTO "public"."Roles" VALUES ('1', 'default', '134200000');
INSERT INTO "public"."Roles" VALUES ('2', 'approved', '5369000000');
INSERT INTO "public"."Roles" VALUES ('3', 'admin', '10740000000');

-- ----------------------------
-- Alter Sequences Owned By 
-- ----------------------------
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

Date: 2018-06-27 21:02:00
*/


-- ----------------------------
-- Table structure for Tokens
-- ----------------------------
DROP TABLE IF EXISTS "public"."Tokens";
CREATE TABLE "public"."Tokens" (
"token" varchar(255) COLLATE "default" NOT NULL,
"registered" timestamp(0) DEFAULT now() NOT NULL,
"used" bool DEFAULT false,
"roleid" int4 DEFAULT 0 NOT NULL
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Alter Sequences Owned By 
-- ----------------------------
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

Date: 2018-06-27 01:34:28
*/


-- ----------------------------
-- Table structure for Uploads
-- ----------------------------
DROP TABLE IF EXISTS "public"."Uploads";
CREATE TABLE "public"."Uploads" (
"id" serial4 NOT NULL,
"filename" varchar(255) COLLATE "default" NOT NULL,
"deleted" bool DEFAULT false NOT NULL,
"userid" int4 NOT NULL,
"uploaddate" timestamp(6) DEFAULT now(),
"filesha" varchar(255) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Alter Sequences Owned By 
-- ----------------------------

-- ----------------------------
-- Uniques structure for table Uploads
-- ----------------------------
ALTER TABLE "public"."Uploads" ADD UNIQUE ("id");

-- ----------------------------
-- Primary Key structure for table Uploads
-- ----------------------------
ALTER TABLE "public"."Uploads" ADD PRIMARY KEY ("id");
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
INSERT INTO "public"."Users" (username, password, token, roleid) VALUES ('username here', 'password here', 'token here', '3');

-- ----------------------------
-- Alter Sequences Owned By 
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table Users
-- ----------------------------
ALTER TABLE "public"."Users" ADD PRIMARY KEY ("id");
