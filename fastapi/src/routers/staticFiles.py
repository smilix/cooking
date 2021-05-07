import os
import typing

from starlette.staticfiles import StaticFiles


class StaticForAngular(StaticFiles):

    def __init__(self, *, directory: str, path_to_exclude: typing.List[str]) -> None:
        super().__init__(directory=directory, packages=None, html=True, check_dir=True)
        self.path_to_exclude = path_to_exclude

    async def lookup_path(self, path: str) -> typing.Tuple[str, typing.Optional[os.stat_result]]:
        full_path, stat_result = await super().lookup_path(path)
        if not full_path and "." not in path and not self._must_exclude(path):
            # a client routing?
            return await super().lookup_path("index.html")

        # print(f"For {path} I got: {full_path}, {stat_result}")
        return full_path, stat_result

    def _must_exclude(self, path: str) -> bool:
        for excl in self.path_to_exclude:
            if path.startswith(excl):
                return True

        return False
