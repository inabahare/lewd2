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

Date: 2018-06-10 20:31:28
*/


-- ----------------------------
-- Table structure for Roles
-- ----------------------------
DROP TABLE IF EXISTS "public"."Roles";
CREATE TABLE "public"."Roles" (
"id" SERIAL NOT NULL,
"name" varchar(255) COLLATE "default",
"uploadsize" int8 DEFAULT 134200000
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of Roles
-- ----------------------------
INSERT INTO "public"."Roles" VALUES ('1', 'admin', '10740000000');
INSERT INTO "public"."Roles" VALUES ('2', 'approved', '5369000000');
INSERT INTO "public"."Roles" VALUES ('3', 'default', '134200000');

-- ----------------------------
-- Table structure for Uploads
-- ----------------------------
DROP TABLE IF EXISTS "public"."Uploads";
CREATE TABLE "public"."Uploads" (
"id" SERIAL NOT NULL,
"filename" varchar(255) COLLATE "default" NOT NULL,
"deleted" bool DEFAULT false NOT NULL,
"userid" int4 NOT NULL,
"uploaddate" timestamp(6) DEFAULT now(),
"filesha" varchar(255) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of Uploads
-- ----------------------------

-- ----------------------------
-- Table structure for Users
-- ----------------------------
DROP TABLE IF EXISTS "public"."Users";
CREATE TABLE "public"."Users" (
"id" SERIAL NOT NULL,
"username" varchar(255) COLLATE "default",
"password" varchar(255) COLLATE "default",
"role" varchar(255) COLLATE "default",
"token" varchar(255) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of Users
-- ----------------------------
INSERT INTO "public"."Users" VALUES ('1', 'inaba', '$2a$04$0FvjWBUAYbIACXgTTiaAVu/MwZZ2xw.X.5SoNxqd7E50cWOF.BLsC', 'admin', 'Boobs');

-- ----------------------------
-- Alter Sequences Owned By 
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table Roles
-- ----------------------------
ALTER TABLE "public"."Roles" ADD PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table Uploads
-- ----------------------------
ALTER TABLE "public"."Uploads" ADD UNIQUE ("id");

-- ----------------------------
-- Primary Key structure for table Uploads
-- ----------------------------
ALTER TABLE "public"."Uploads" ADD PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table Users
-- ----------------------------
ALTER TABLE "public"."Users" ADD PRIMARY KEY ("id");
