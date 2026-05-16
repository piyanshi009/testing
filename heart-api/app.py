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

MODEL_KNN_PATH = os.path.join(
    MODELS_DIR,
    "heart_knn_pipeline.pkl"
)

models = {}
try:
    if os.path.exists(MODEL_KNN_PATH):

        with open(MODEL_KNN_PATH, "rb") as f:
            models["knn"] = pickle.load(f)

        logging.info("KNN Pipeline loaded successfully")

    else:
        logging.error("KNN model file not found")

except Exception as e:
    logging.error(f"Error loading model: {e}")


@app.get("/")
def home():

    return {
        "message": "Heart Disease Prediction API Running 🚀",
        "model_used": "KNN",
        "features_used": selected_features
    }

@app.post("/predict")
def predict(data: InputData):

    try:
        model = models["knn"]

        # preprocess input
        input_data = preprocess_input(data)

        # prediction
        prediction = model.predict(input_data)[0]

        # probability
        probs = model.predict_proba(input_data)[0]
        probability = float(probs[prediction])

# correct label mapping
        if prediction == 0:
            result_text = "High Risk ⚠️"
        else:
            result_text = "Low Risk ✅"
        return {
            "prediction": int(prediction),
            "result": result_text,
            "probability": round(probability, 3),
            "model_used": "KNN",
            "features_used": selected_features
        }

    except Exception as e:
        logging.error(str(e))

        return {
            "error": str(e)
        }