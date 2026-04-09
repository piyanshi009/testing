# HeartCare AI: Advanced Heart Disease Prediction System

HeartCare AI is a premium, professional-grade medical dashboard designed to provide real-time heart disease risk assessment. It combines a state-of-the-art machine learning backend with a modern, glassmorphic web interface to deliver an intuitive and powerful diagnostic tool.

![HeartCare AI Screenshot](https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=2000&auto=format&fit=crop) *(Example UI Concept)*

## 🚀 Features

- **Gassmorphic UI**: High-end medical dashboard design with depth, translucency, and fluid animations.
- **Real-time Diagnostics**: Immediate risk assessment based on 13 critical biometric factors.
- **Dynamic Data Visualization**: Interactive charts for vital sign monitoring and health trends.
- **Multi-step Diagnostic Flow**: User-friendly form management with validation and progress tracking.
- **Professional Health Insights**: Context-aware clinical recommendations based on prediction results.
- **Secure-look Auth Flow**: Integrated mock login for a complete application experience.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19
- **Styling**: Vanilla CSS (Custom properties / Variables)
- **UI Components**: Material UI (MUI)
- **Animations**: Framer Motion
- **Icons**: Lucide React & MUI Icons
- **Charts**: Recharts
- **Notifications**: Notistack

### Backend
- **Framework**: FastAPI (Python)
- **Machine Learning**: Scikit-learn (Random Forest & Decision Tree models)
- **Data Processing**: NumPy & Pandas
- **Serialization**: Pickle

## 📁 Project Structure

```bash
pbl_project/
├── heart-api/            # FastAPI Backend
│   ├── app.py            # Main API entry point
│   ├── heart_model.pkl   # Trained ML model
│   └── scaler.pkl        # Data scaler for normalization
├── heart-frontend/       # React Frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── layouts/      # Dashboard and Page layouts
│   │   ├── App.js        # Main logic and routing
│   │   └── index.css     # Global design system
│   └── package.json
└── venv/                 # Python Virtual Environment
```

## ⚙️ Setup & Installation

### 1. Backend Setup (API)
Navigate to the `heart-api` directory:
```bash
cd heart-api
..\venv\Scripts\activate  # On Windows
pip install -r requirements.txt  # If requirements.txt exists
uvicorn app:app --reload --port 8000
```

### 2. Frontend Setup
Navigate to the `heart-frontend` directory:
```bash
cd heart-frontend
npm install
npm start
```

## 📊 ML Model Details
The system utilizes a Random Forest Classifier trained on clinical datasets. It processes features such as:
- **Biometrics**: Age, Sex, Resting BP, Cholesterol.
- **Clinical Tests**: Chest Pain Type (CP), FBS, RestECG, Oldpeak, Slope.
- **Advanced Indicators**: Thalach, Exang, CA, Thal.

## 📄 License
This project is developed for educational/PBL purposes.

---
*Disclaimer: This tool is for educational purposes and should not be used as a substitute for professional medical advice.*
