#!/bin/bash

export PYTHONUNBUFFERED=1
./venv/bin/uvicorn --reload --reload-dir src --app-dir src main:app
