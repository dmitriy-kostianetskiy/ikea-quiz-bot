#!/usr/bin/env bash

export $(cat .env.debug | xargs) && node index.js