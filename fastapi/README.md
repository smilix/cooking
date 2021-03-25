# Fastapi backend

## Dev

Run a local server with

```shell
./run-dev-server.sh
```

## Install

Install requirements and create the venv:
```shell
# may needed
apt install python3-pip python3-venv rustc 
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

Create a `ENV` file in the `fastapi` folder and set your configuration. E.g.:
```ini
upload_folder=/foo/bar/upload
sqlite_file=/foo/bar/my.db
secret_key=...
```

Use the `cooking.service` file to start the backend as a service.

## Dev docs

* https://fastapi.tiangolo.com/
* https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/
