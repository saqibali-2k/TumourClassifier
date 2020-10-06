# Tumour Classifier

A webapp that predicts whether an image of a skin tumor is benign or malignant. Disclaimer: this app is not created to provide medical advice, its just a fun experiment.

# Structure

1. The model is trained with tensorflow in python (see __Trainer/model.py__).
2. A python flask server hosts this trained model. It preprocesses images sent from the front-end, then feeds into the Neural Net. (see __Trainer/server.py__)
3. The front-end is created with react and styled with bootstrap. It makes API calls to the flask server and sends base64 encodings of images, the prediciton is returned by the server. (see __app/__ )

# Features

You may upload images from your device using the browse button.
![Using the browse button.](https://github.com/saqibali-2k/TumourClassifier/blob/main/readme_resources/browse_button.jpg "browse button")

You can use your camera to take a picture too.
![Using the camera feature](https://github.com/saqibali-2k/TumourClassifier/blob/main/readme_resources/camera_button.jpg "Camera button")

When you have your picture, use the predict button.

![Using predict button](https://github.com/saqibali-2k/TumourClassifier/blob/main/readme_resources/tumor-classifier-usage.gif "Gif of using app")

### Todos: ###
* Improve preprocessing to account for pictures that are not taken perfectly (wear there is little background noise, and the main focus is the tumour)
* Improve CSS styling
