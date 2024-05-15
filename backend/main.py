from fastapi import FastAPI, HTTPException
import pandas as pd
import os
import datetime
from pydantic import BaseModel
from predictive import PredictiveModel

# Whatever as long as it works
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# load the 2 datasets for statistics
print("Loading datasets...")
data_folder = "data"
nop = pd.read_csv(os.path.join(data_folder, "number_of_participants_v1.csv"))
journey = pd.read_csv(os.path.join(data_folder, "journey_final.csv"))
print("Finished loading")

class TrendQuery(BaseModel):
    regions: list[str]
    season: list[int]
    period: int
    age_group: list[int]

year = datetime.date.today().year

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
    df = df[(df["Month"] >= season[0]) & (df["Month"] <= season[1])]
    df = df[(df["Year"] >= (year - period)) & (df["Year"] < year)]
    df = df[(df["Age"] >= age_group[0]) & (df["Age"] <= age_group[1])]
    df = df.groupby("JourneyProductCode").agg({
        "Age": "count",
        "JourneyProductName": "first",
        "Duration": "first",
    }).reset_index().rename({"Age": "SalesCount"}, axis=1).sort_values(["SalesCount"], ascending=False).head(10)
    response = df.to_dict(orient="records")
    return response


@app.post("/trend/travels")
async def trend_travels(
    query: TrendQuery
):
    """
    Show trending travels
    """
    regions = query.regions
    season = query.season
    age_group = query.age_group
    period = query.period
    
    years = range(year - period, year)
    
    df = journey[(journey["Age"] >= age_group[0]) & (journey["Age"] <= age_group[1])]
    df = df[df["CustomerState"].isin(regions)]
    df = df[(df["Month"] >= season[0]) & (df["Month"] <= season[1])]
    df = df[(df["Year"] >= (year - period)) & (df["Year"] < year)]
    df = df.sort_values(["Year", "Month"])
    response = {}
    for region in regions:
        dfr = df[df["CustomerState"] == region]
        dfr = dfr.groupby(["Year", "Month"]).agg({"Age": "count"}).reset_index()
        dfr = dfr.rename({"Age": "SalesCount"}, axis=1)
        response[region] = dfr.to_dict(orient="records")
    # response = {}
    # for region in regions:
    #     df_region = df[df["CustomerState"] == region]
    #     response[region] = {}
    #     for cur_year in years:
    #         response[region][cur_year] = {}
    #         gf = df_region[df_region["Year"] == cur_year]
    #         for month in range(season[0], season[1]+1):
    #             gfm = gf[gf["Month"]==month]
    #             response[region][cur_year][month] = len(gfm)
    return response


@app.post("/trend/regions")
async def trend_regions(
    query: TrendQuery
):
    """
    Show regional trends
    """
    regions = query.regions
    season = query.season
    age_group = query.age_group
    period = query.period
    
    years = range(year - period, year)
    df = journey[(journey["Age"] >= age_group[0]) & (journey["Age"] <= age_group[1])]
    stat = {}
    for region in regions:
        df_region = df[df["CustomerState"] == region]
        stat[region] = {}
        for cur_year in years:
            stat[region][cur_year] = []
            gf = df_region[df_region["Year"] == cur_year]
            for month in range(season[0], season[1]+1):
                gfm = gf[gf["Month"]==month]
                stat[region][cur_year].append(len(gfm))
    response = {}
    season_diff = season[1] - season[0] + 1
    for region in regions:
        response[region] = sum([sum(stat[region][y]) for y in years])/(period*season_diff)
    return response

class SalesArea(BaseModel):
    name: str
    future_period: int # how many years in future, from 2024 onwards


@app.post("/predictive")
async def predictive(
    sales_area: SalesArea
):
    """
    Show monthly product sales prediction for a few years
    """
    name = sales_area.name
    future_period = sales_area.future_period
    steps = future_period*12
    past_period = 2 # return 2 nearest years
    if name == "all":
        y = nop[nop["Year"] < year].groupby(["Year", "Month"]).agg({
            "Number_of_participants": "sum"
        })["Number_of_participants"]
    else:
        nops = nop[nop["Sales_area"] == name]
        if len(nops) < past_period*12:
            raise HTTPException(400, "There is not enough data for this sale area")
        y = nops[nops["Year"] < year].groupby(["Year", "Month"]).agg({
            "Number_of_participants": "sum"
        })["Number_of_participants"]
    m = PredictiveModel(name, y)
    forecast = m.predict(steps)
    return {"history": y[-past_period*12:].tolist(), "forecast": forecast.tolist()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=10000)
