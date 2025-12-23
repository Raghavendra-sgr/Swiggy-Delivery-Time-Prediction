from flask import Flask, render_template, request, jsonify
from sklearn.pipeline import Pipeline
import pandas as pd
import joblib
from sklearn import set_config

# set the output as pandas
set_config(transform_output='pandas')

app = Flask(__name__)

# Load model and preprocessor from local models folder
def load_model(model_path):
    model = joblib.load(model_path)
    return model

# Load the model and preprocessor
model = load_model("models/model.joblib")
preprocessor = load_model("models/preprocessor.joblib")

# Build the model pipeline
model_pipe = Pipeline(steps=[
    ('preprocess', preprocessor),
    ("regressor", model)
])

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Create DataFrame with the input data
        pred_data = pd.DataFrame({
            'age': [float(data['age'])],
            'ratings': [float(data['ratings'])],
            'weather': [data['weather']],
            'traffic': [data['traffic']],
            'vehicle_condition': [int(data['vehicle_condition'])],
            'type_of_order': [data['type_of_order']],
            'type_of_vehicle': [data['type_of_vehicle']],
            'multiple_deliveries': [float(data['multiple_deliveries'])],
            'festival': [data['festival']],
            'city_type': [data['city_type']],
            'is_weekend': [int(data['is_weekend'])],
            'pickup_time_minutes': [float(data['pickup_time_minutes'])],
            'order_time_of_day': [data['order_time_of_day']],
            'distance': [float(data['distance'])],
            'distance_type': [data['distance_type']]
        })
        
        # Make prediction
        prediction = model_pipe.predict(pred_data)[0]
        
        return jsonify({
            'success': True,
            'prediction': round(prediction, 2)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
