import numpy as np
import cv2
import mediapipe as mp
from tensorflow.keras.models import load_model

# Load the trained model
model = load_model("asl_app/cnn_model/asl_model_mediapipe5.h5")

# Define label classes
classes = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

# Initialize MediaPipe
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False,
                       max_num_hands=1,
                       min_detection_confidence=0.7)
mp_draw = mp.solutions.drawing_utils

# Offset for cropping
OFFSET = 20

def predict_sign(frame):
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Get bounding box
            h, w, _ = frame.shape
            x_min = w
            y_min = h
            x_max = y_max = 0

            for lm in hand_landmarks.landmark:
                x, y = int(lm.x * w), int(lm.y * h)
                x_min = min(x_min, x)
                y_min = min(y_min, y)
                x_max = max(x_max, x)
                y_max = max(y_max, y)

            # Apply offset and crop
            x_min = max(x_min - OFFSET, 0)
            y_min = max(y_min - OFFSET, 0)
            x_max = min(x_max + OFFSET, w)
            y_max = min(y_max + OFFSET, h)

            hand_img = frame[y_min:y_max, x_min:x_max]
            hand_img = cv2.resize(hand_img, (64, 64))
            hand_img = hand_img / 255.0
            hand_img = np.expand_dims(hand_img, axis=0)

            # Predict
            prediction = model.predict(hand_img)[0]
            class_idx = np.argmax(prediction)
            confidence = prediction[class_idx]
            predicted_char = classes[class_idx]

            # Draw bounding box and prediction on frame
            cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
            cv2.putText(frame, f'{predicted_char} ({confidence:.2f})', (x_min, y_min - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)

            return predicted_char, confidence

    return "", 0.0  # No hand detected