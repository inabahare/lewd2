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
"id" int4 DEFAULT nextval('"Uploads_id_seq"'::regclass) NOT NULL,
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
