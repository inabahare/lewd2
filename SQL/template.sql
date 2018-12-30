/*
 Navicat Premium Data Transfer

 Source Server         : LocalPost
 Source Server Type    : PostgreSQL
 Source Server Version : 100006
 Source Host           : localhost:5432
 Source Catalog        : lewd
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 100006
 File Encoding         : 65001

 Date: 29/12/2018 13:19:40
*/


-- ----------------------------
-- Sequence structure for Uploads_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."Uploads_id_seq";
CREATE SEQUENCE "public"."Uploads_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for Users_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."Users_id_seq";
CREATE SEQUENCE "public"."Users_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for LoginTokens
-- ----------------------------
DROP TABLE IF EXISTS "public"."LoginTokens";
CREATE TABLE "public"."LoginTokens" (
  "token" varchar(255) COLLATE "pg_catalog"."default",
  "registered" timestamp(6),
  "userid" int4
)
;

-- ----------------------------
-- Table structure for RegisterTokens
-- ----------------------------
DROP TABLE IF EXISTS "public"."RegisterTokens";
CREATE TABLE "public"."RegisterTokens" (
  "token" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "registered" timestamp(0) NOT NULL DEFAULT now(),
  "used" bool DEFAULT false,
  "roleid" int4 NOT NULL DEFAULT 0,
  "uploadsize" int8 NOT NULL,
  "isadmin" bool DEFAULT false
)
;

-- ----------------------------
-- Table structure for Roles
-- ----------------------------
DROP TABLE IF EXISTS "public"."Roles";
CREATE TABLE "public"."Roles" (
  "id" int4 NOT NULL,
  "name" varchar(255) COLLATE "pg_catalog"."default",
  "uploadsize" int8 DEFAULT 134200000
)
;

-- ----------------------------
-- Table structure for Transparency
-- ----------------------------
DROP TABLE IF EXISTS "public"."Transparency";
CREATE TABLE "public"."Transparency" (
  "Date" date,
  "FileName" varchar(255) COLLATE "pg_catalog"."default",
  "FileHash" varchar(255) COLLATE "pg_catalog"."default",
  "Type" varchar(255) COLLATE "pg_catalog"."default",
  "Origin" varchar(255) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for UpdatePasswordKeys
-- ----------------------------
DROP TABLE IF EXISTS "public"."UpdatePasswordKeys";
CREATE TABLE "public"."UpdatePasswordKeys" (
  "key" varchar(20) COLLATE "pg_catalog"."default",
  "registered" timestamp(6),
  "userId" int8
)
;

-- ----------------------------
-- Table structure for Uploads
-- ----------------------------
DROP TABLE IF EXISTS "public"."Uploads";
CREATE TABLE "public"."Uploads" (
  "id" int4 NOT NULL DEFAULT nextval('"Uploads_id_seq"'::regclass),
  "filename" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "userid" int4 NOT NULL,
  "uploaddate" timestamp(6) DEFAULT now(),
  "filesha" varchar(255) COLLATE "pg_catalog"."default",
  "deleted" bool NOT NULL DEFAULT false,
  "duplicate" bool NOT NULL DEFAULT false,
  "originalname" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "virus" bool DEFAULT false,
  "passworded" bool DEFAULT false,
  "deletionkey" varchar(36) COLLATE "pg_catalog"."default",
  "size" int8,
  "scannedTwice" bool DEFAULT false,
  "virustotalScan" int4 NOT NULL
)
;
COMMENT ON COLUMN "public"."Uploads"."size" IS 'Size in bytes';

-- ----------------------------
-- Table structure for Users
-- ----------------------------
DROP TABLE IF EXISTS "public"."Users";
CREATE TABLE "public"."Users" (
  "id" int4 NOT NULL DEFAULT nextval('"Users_id_seq"'::regclass),
  "username" varchar(255) COLLATE "pg_catalog"."default",
  "password" varchar(255) COLLATE "pg_catalog"."default",
  "token" varchar(255) COLLATE "pg_catalog"."default",
  "roleid" int2,
  "uploadsize" int8,
  "isadmin" bool DEFAULT false
)
;