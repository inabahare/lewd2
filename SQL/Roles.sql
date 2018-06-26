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

Date: 2018-06-27 01:34:06
*/


-- ----------------------------
-- Table structure for Roles
-- ----------------------------
DROP TABLE IF EXISTS "public"."Roles";
CREATE TABLE "public"."Roles" (
"id" int4 DEFAULT nextval('"Roles_id_seq"'::regclass) NOT NULL,
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

-- ----------------------------
-- Primary Key structure for table Roles
-- ----------------------------
ALTER TABLE "public"."Roles" ADD PRIMARY KEY ("id");
