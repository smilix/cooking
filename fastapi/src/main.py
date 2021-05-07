from fastapi import FastAPI

from internals.config import settings
from routers import sessions, users, docs, categories, recipes
from routers.staticFiles import StaticForAngular

app = FastAPI(docs_url=None, redoc_url=None)

prefix = "/api"
app.include_router(sessions.router, prefix=prefix)
app.include_router(users.router, prefix=prefix)
app.include_router(categories.router, prefix=prefix)
app.include_router(recipes.router, prefix=prefix)
app.include_router(docs.router)

app.mount("/", StaticForAngular(directory=settings.static_html_folder, path_to_exclude=["api/", "docs/"]), name="static")
