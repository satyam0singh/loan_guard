from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load model and scaler
model = joblib.load('model.pkl')
scaler = joblib.load('scaler.pkl')

# Mappings (must match train_model.py)
EDUCATION_MAP = {'Bachelors': 1, 'PhD': 3, 'Masters': 2, 'High School': 0}
HOUSING_MAP = {'Own': 2, 'Rent': 0, 'Mortgage': 1}

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Extract features
        age = float(data['age'])
        income = float(data['income'])
        loan_amount = float(data['loan_amount'])
        credit_score = float(data['credit_score'])
        employment_years = float(data['employment_years'])
        
        # Map categorical features
        education = EDUCATION_MAP.get(data['education'], 0)
        housing = HOUSING_MAP.get(data['housing'], 0)
        
        # Prepare feature array
        features = np.array([[age, income, loan_amount, credit_score, employment_years, education, housing]])
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Predict
        prediction = model.predict(features_scaled)[0]
        
        # Return result (0 = No Default/Eligible, 1 = Default/Not Eligible)
        # However, the user asked for "Eligible for loan or not". 
        # In the context of "Default", 0 means they are good (Eligible).
        result = "Eligible" if prediction == 0 else "Not Eligible"
        
        return jsonify({
            'prediction': int(prediction),
            'status': result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
