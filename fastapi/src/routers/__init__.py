from fastapi import HTTPException

not_found_ex = HTTPException(status_code=404, detail="Not found")