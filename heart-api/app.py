# ===============================
# IMPORTS
# ===============================
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pickle

from fastapi.middleware.cors import CORSMiddleware
import logging

# ===============================
# APP INIT
# ===============================
app = FastAPI(title="Heart Disease Prediction API")

# Logging setup
logging.basicConfig(level=logging.INFO)

# ===============================
# CORS (Frontend connect ke liye)
# ===============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# LOAD MODEL
# ===============================
model = pickle.load(open("models/heart_model.pkl", "rb"))
scaler = pickle.load(open("models/scaler.pkl", "rb"))

# ===============================
# INPUT SCHEMA (Improved)
# ===============================
class InputData(BaseModel):
    age: int
    sex: int
    cp: int
    trestbps: float
    chol: float
    fbs: int
    restecg: int
    thalach: float
    exang: int
    oldpeak: float
    slope: int
    ca: int
    thal: int

# ===============================
# ROUTES
# ===============================

@app.get("/")
def home():
    return {"message": "Heart Disease Prediction API Running 🚀"}

@app.get("/health")
def health():
    return {"status": "API is healthy ✅"}

@app.post("/predict")
def predict(data: InputData):
    try:
        logging.info("Prediction request received")

        # convert input to array
        input_data = np.array([[
            data.age, data.sex, data.cp, data.trestbps,
            data.chol, data.fbs, data.restecg, data.thalach,
            data.exang, data.oldpeak, data.slope, data.ca, data.thal
        ]])

        # scaling
        input_data = scaler.transform(input_data)

        # prediction
        prediction = model.predict(input_data)[0]
        probability = model.predict_proba(input_data)[0][1]

        # user-friendly output
        result_text = "High Risk ⚠️" if prediction == 1 else "Low Risk ✅"

        return {
            "prediction": int(prediction),
            "result": result_text,
            "probability": float(probability)
        }

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return {"error": str(e)}