from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWTError
from src import config

app = FastAPI()

# Secret key and algorithm are imported from config

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwtoken: str) -> bool:
        try:
            payload = jwt.decode(jwtoken, config.JWT_SECRET, algorithms=[config.JWT_ALGORITHM])
            return True
        except PyJWTError:
            return False

# Example protected API from chatGPT, feel free to experiment
@app.get("/protected")
async def protected_route(token: str = Depends(JWTBearer())):
    return {"message": "Protected data accessed"}

@app.get("/user-details")
async def user_details(token: str = Depends(JWTBearer())):
    # Simulated user data retrieval logic
    user_data = {
        "username": "johndoe",
        "email": "john.doe@example.com",
        "roles": ["admin", "user"]
    }
    return {"message": "User data fetched successfully", "data": user_data}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
