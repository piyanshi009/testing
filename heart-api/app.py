# ===============================
# IMPORTS
# ===============================


from fastapi import FastAPI, Query
import pandas as pd
import pickle
import logging
import os

from fastapi.middleware.cors import CORSMiddleware
from models import InputData
# print("🔥 NEW CODE RUNNING 🔥")
# ===============================
# APP INIT
# ===============================
app = FastAPI(title="Heart Disease Prediction API")

logging.basicConfig(level=logging.INFO)

# ===============================
# CORS
# ===============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# MODEL PATHS (FIXED)
# ===============================
MODELS_DIR = "models"

MODEL_LR_PATH = os.path.join(MODELS_DIR, "heart_lr_pipeline.pkl")
FEATURES_PATH = os.path.join(MODELS_DIR, "features.pkl")

models = {}

# ===============================
# LOAD MODEL + FEATURES
# ===============================
try:
    if os.path.exists(MODEL_LR_PATH):
        models["logistic_regression"] = pickle.load(open(MODEL_LR_PATH, "rb"))
        logging.info("Logistic Regression Pipeline loaded")

        # 🔥 DEBUG
        print("Model type:", type(models["logistic_regression"]))

    if os.path.exists(FEATURES_PATH):
        selected_features = pickle.load(open(FEATURES_PATH, "rb"))
        logging.info(f"Selected features loaded: {selected_features}")
    else:
        raise Exception("features.pkl not found")

except Exception as e:
    logging.error(f"Error loading models/features: {e}")

# ===============================
# PREPROCESS FUNCTION (FIXED)
# ===============================
def preprocess_input(data: InputData):
    input_dict = {
        "age": data.age,
        "sex": data.sex,
        "cp": data.cp,
        "trestbps": data.trestbps,
        "chol": data.chol,
        "fbs": data.fbs,
        "restecg": data.restecg,
        "thalach": data.thalach,
        "exang": data.exang,
        "oldpeak": data.oldpeak,
        "slope": data.slope,
        "ca": data.ca,
        "thal": data.thal
    }

    # ✅ Convert to DataFrame
    df_input = pd.DataFrame([input_dict])

    # ✅ Select only trained features in correct order
    df_input = df_input[selected_features]

    return df_input

# ===============================
# ROUTES
# ===============================

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

        # ===============================
        # PREPROCESS
        # ===============================
        input_data = preprocess_input(data)

        print("Input:", input_data)

        # ===============================
        # PREDICT
        # ===============================
        probs = model.predict_proba(input_data)[0]

        # print("===== DEBUG =====")
        # print("FEATURES USED:", selected_features)
        # print("INPUT DF:\n", input_data)
        # print("RAW PROBS:", probs)
        probability = float(probs[1])

        # ===============================
        # THRESHOLD
        # ===============================
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