# American Sign Language Detection

A real-time American Sign Language (ASL) detection web application built using TensorFlow/Keras, MediaPipe, OpenCV, and Django.

The project captures live webcam input, detects hand gestures, and predicts ASL alphabet signs using a Convolutional Neural Network (CNN). Predicted letters are streamed directly to the browser in real time.

## Project Overview

The AI pipeline works in 3 stages:

1. OpenCV captures live webcam frames
2. MediaPipe detects and isolates the hand region
3. A CNN model classifies the ASL sign and returns:
   - Predicted letter
   - Confidence score

The application also includes additional logic for smoother text generation:

- A letter is added only if prediction confidence exceeds 80%
- A space is automatically inserted if no hand is detected for 25+ consecutive frames
- Results are streamed live to the frontend using Django APIs

## Tech Stack

| Technology | Purpose |
|------------|---------|
| TensorFlow / Keras | CNN model training and prediction |
| MediaPipe | Hand detection and tracking |
| OpenCV | Webcam frame capture |
| Django | Backend and API handling |
| NumPy | Image and array processing |

## CNN Architecture

The classification model uses a custom CNN architecture containing:

- 3 Convolutional Layers
- ReLU activation functions
- Pooling layers
- Dense layers
- Softmax output classifier

The model is trained to identify ASL alphabet gestures from processed hand images.

## Project Structure

```bash
American-Sign-Language-detection/
│
├── app/                  # Django application
├── model/                # Trained CNN model
├── static/               # CSS, JS, and assets
├── templates/            # HTML templates
├── dataset/              # Training dataset
├── manage.py
├── requirements.txt
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/Moksh2125/American-Sign-Language-detection.git
cd American-Sign-Language-detection
```

Create a virtual environment:

### Windows

```bash
python -m venv env
env\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv env
source env/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the Django server:

```bash
python manage.py runserver
```

## Usage

1. Start the Django development server
2. Open the local browser URL
3. Allow webcam access
4. Show ASL hand signs in front of the camera
5. View predictions in real time
