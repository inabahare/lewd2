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

Date: 2018-06-27 01:34:17
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
