from fastapi import FastAPI
import pickle
import logging
import os

from fastapi.middleware.cors import CORSMiddleware
from models import InputData
from utils import preprocess_input, selected_features

app = FastAPI(title="Heart Disease Prediction API")

logging.basicConfig(level=logging.INFO)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODELS_DIR = "models"
MODEL_LR_PATH = os.path.join(MODELS_DIR, "heart_lr_pipeline.pkl")

models = {}

try:
    if os.path.exists(MODEL_LR_PATH):
        with open(MODEL_LR_PATH, "rb") as f:
            models["logistic_regression"] = pickle.load(f)

        logging.info("Logistic Regression Pipeline loaded")

except Exception as e:
    logging.error(f"Error loading model: {e}")


@app.get("/")
def home():
    return {
        "message": "Heart Disease Prediction API Running 🚀",
        "features_used": selected_features
    }


@app.post("/predict")
def predict(data: InputData):
    try:
        model = models["logistic_regression"]

        # utility function call
        input_data = preprocess_input(data)

        probs = model.predict_proba(input_data)[0]
        probability = float(probs[1])

        if probability > 0.3:
            result_text = "High Risk ⚠️"
            prediction = 1
        else:
            result_text = "Low Risk ✅"
            prediction = 0

        return {
            "prediction": prediction,
            "result": result_text,
            "probability": round(probability, 3),
            "features_used": selected_features
        }

    except Exception as e:
        logging.error(str(e))
        return {"error": str(e)}