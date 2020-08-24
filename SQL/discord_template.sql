ALTER TABLE "RegisterTokens"
ADD COLUMN "discordId" varchar;

ALTER TABLE "Users"
ADD COLUMN "discordId" varchar;

CREATE TABLE "public"."Applicants" (
  "DiscordId" varchar(255) NOT NULL,
  "AppliedAt" time,
  PRIMARY KEY ("DiscordId")
)
;