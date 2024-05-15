import hashlib
import os
import pickle
from statsmodels.tsa.statespace.sarimax import SARIMAX, SARIMAXResults

# Models stored in form sarima_<Sales area name hash>.pickle
class PredictiveModel:
    def __init__(self, name, y):
        self.name = name
        self.res: SARIMAXResults = None
        path = self.get_sales_area_model_path()
        if os.path.exists(path):
            with open(path, "rb+") as f:
                self.res = pickle.load(f)
        else:
            self.train(y)

    def get_sales_area_hash(self):
        return hashlib.sha256(self.name.encode()).hexdigest()[:6]

    def get_sales_area_model_path(self):
        hash_name = self.get_sales_area_hash()
        return os.path.join("data", f"sarima_{hash_name}.pickle")

    def train(self, y):
        sarima = SARIMAX(y, order=(1, 1, 1), seasonal_order=(1,1,1,12))
        res = sarima.fit()
        path = self.get_sales_area_model_path()
        with open(path, "wb+") as f:
            pickle.dump(res, f)
        self.res = res
        return res
    
    def predict(self, steps: int):
        return self.res.get_forecast(steps).predicted_mean
