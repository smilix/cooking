import os
import typing

from starlette.staticfiles import StaticFiles


class StaticForAngular(StaticFiles):

    def __init__(self, *, directory: str, api_path_to_exclude: str) -> None:
        super().__init__(directory=directory, packages=None, html=True, check_dir=True)
        self.api_path_to_exclude = api_path_to_exclude

    async def lookup_path(self, path: str) -> typing.Tuple[str, typing.Optional[os.stat_result]]:
        full_path, stat_result = await super().lookup_path(path)
        if not full_path and not path.startswith(self.api_path_to_exclude) and "." not in path:
            # a client routing?
            return await super().lookup_path("index.html")

        # print(f"For {path} I got: {full_path}, {stat_result}")
        return full_path, stat_result
