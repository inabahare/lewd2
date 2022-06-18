#!/bin/bash

psql postgres < /SQL/template.sql
psql postgres < /SQL/discord_template.sql