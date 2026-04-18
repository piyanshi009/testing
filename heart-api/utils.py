import pandas as pd
import pickle
import os

MODELS_DIR = "models"
FEATURES_PATH = os.path.join(MODELS_DIR, "features.pkl")

with open(FEATURES_PATH, "rb") as f:
    selected_features = pickle.load(f)

def preprocess_input(data):
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

    df_input = pd.DataFrame([input_dict])

    df_input = df_input[selected_features]

    return df_input