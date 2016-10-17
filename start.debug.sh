#!/usr/bin/env bash

NODE_ENV=debug
TOKEN=289111243:AAHR2CdgcKdALyZVmSwxbleJOo5IhCMm7R0
MONGO=mongodb://admin:admin@ds033996.mlab.com:33996/ikea-quiz-db

export $(cat .env.debug | xargs) && node index.js