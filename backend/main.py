from fastapi import FastAPI, Request, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWTError
from src import config
import pandas as pd
import os
from typing import List
import datetime
from pydantic import BaseModel

# load the 2 datasets for statistics
print("Loading datasets...")
nop = pd.read_csv(os.path.join(config.DATA_PATH, "number_of_participants_v1.csv"))
journey = pd.read_csv(os.path.join(config.DATA_PATH, "journey_final.csv"))
print("Finished loading")

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

class TrendQuery(BaseModel):
    regions: list[str]
    season: list[int]
    period: int
    age_group: list[int]

@app.post("/trend/products")
async def trend_products(
    query: TrendQuery
):
    """
    Show trending products limited by some time params

    regions: Germany state, utf-8 encoded
    season: tuple of 2 ints for two bounding months [4, 10]
    period: last N year from 2024
    age_group: two ints defining an age group
    """
    regions = query.regions
    season = query.season
    age_group = query.age_group
    period = query.period
    
    df = journey[journey["CustomerState"].isin(regions)]
    df = df[(df["Month"] > season[0]) & (df["Month"] < season[1])]
    year = datetime.date.today().year
    df = df[(df["Year"] >= (year - period)) & (df["Year"] < year)]
    df = df[(df["Age"] >= age_group[0]) & (df["Age"] <= age_group[1])]
    print(df)
    df = df.groupby("JourneyProductCode").agg({
        "Age": "count",
        "JourneyProductName": "first",
        "Duration": "first",
    }).reset_index().rename({"Age": "SalesCount"}, axis=1).sort_values(["SalesCount"]).head(10)
    response = df.to_dict(orient="records")
    return response




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=10000, reload=True)
