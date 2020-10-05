from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS, cross_origin
import numpy as np
import base64
from PIL import Image
import tensorflow as tf
import io
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.preprocessing.image import img_to_array

app = Flask(__name__)

def load_model():
    global model
    model = tf.keras.models.load_model("model_save_best.h5")
    print("--------------------MODEL LOADED.----------------------", flush=True)


load_model()
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def preprocess_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    return image


@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
    message = request.get_json(force=True)
    base64encoding = message['image']
    base64_bytes = base64.b64decode(base64encoding)
    image = Image.open(io.BytesIO(base64_bytes))
    resized_image = preprocess_image(image, target_size=(224, 224))

    prediction = model.predict(resized_image)
    probabilities = np.exp(prediction) / np.sum(np.exp(prediction))
    output = probabilities.tolist()

    response = {
        "prediction": {
            'benign': output[0][0],
            'malignant': output[0][1]
        }
    }
    return jsonify(response)
