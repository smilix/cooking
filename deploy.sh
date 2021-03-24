#!/bin/bash

rsync -n -avzi --delete --exclude="__pycache__/" \
    fastapi/requirements.txt fastapi/cooking.service fastapi/src fastapi/static \
    netcup:/home/smile/cooking/app/

echo "ENTER to continue or CTRL+C to cancel."
read

rsync -avzi --delete --exclude="__pycache__/" \
    fastapi/requirements.txt fastapi/cooking.service fastapi/src fastapi/static \
    netcup:/home/smile/cooking/app/
