import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
import joblib
import os

# Load dataset
data_path = 'credit_risk_dataset.csv'
if not os.path.exists(data_path):
    print(f"Error: {data_path} not found!")
    exit()

df = pd.read_csv(data_path)

# Preprocessing
# 1. Handle missing values
df['Income'] = df['Income'].fillna(df['Income'].mean())

# 2. Map Categorical variables
education_order = {'Bachelors': 1, 'PhD': 3, 'Masters': 2, 'High School': 0}
housing_order = {'Own': 2, 'Rent': 0, 'Mortgage': 1}

df['Education_Level'] = df['Education_Level'].map(education_order)
df['Housing_Status'] = df['Housing_Status'].map(housing_order)

# Features and Target
X = df[['Age', 'Income', 'Loan_Amount', 'Credit_Score', 'Employment_Years', 'Education_Level', 'Housing_Status']]
y = df['Default']

# Scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train Model
# Using DecisionTreeClassifier as seen in the notebook
model = DecisionTreeClassifier(random_state=42)
model.fit(X_scaled, y)

# Save model and scaler
joblib.dump(model, 'model.pkl')
joblib.dump(scaler, 'scaler.pkl')

print("Model and Scaler saved successfully!")
