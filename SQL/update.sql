/*
 Navicat Premium Data Transfer

 Source Server         : Lewd.se
 Source Server Type    : PostgreSQL
 Source Server Version : 100005
 Source Host           : localhost:5432
 Source Catalog        : lewd
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 100005
 File Encoding         : 65001

 Date: 21/10/2018 22:20:34
*/


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
