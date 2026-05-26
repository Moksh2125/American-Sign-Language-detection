from django.http import StreamingHttpResponse
from .utils.predict import predict_sign
from django.http import JsonResponse
from django.shortcuts import render
from .models import ASLSign
from django.db import models
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import threading
import mediapipe as mp
import cv2
import json

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.7)
mp_draw = mp.solutions.drawing_utils

camera_lock = threading.Lock()
detected_text = []
no_hand_frame_count = 0 # Counter for frames without a hand

def generate_frames():
    global detected_text, no_hand_frame_count # Add the new counter here
    
    cap = cv2.VideoCapture(0)
    HAND_CONFIDENCE_THRESHOLD = 0.8 # Confidence for adding a letter
    SPACE_FRAME_THRESHOLD = 25 # Number of frames without a hand to trigger a space

    while True:
        with camera_lock:
            success, frame = cap.read()

        if not success:
            break

        predicted_char, confidence = predict_sign(frame) # predict_sign returns the hand image with overlays

        # If a hand is clearly detected, add the character and reset the 'no hand' counter
        if confidence > HAND_CONFIDENCE_THRESHOLD:
            no_hand_frame_count = 0 # Reset counter because a hand was found
            if not detected_text or detected_text[-1] != predicted_char:
                detected_text.append(predicted_char)
                print(f"Detected: {predicted_char}, Confidence: {confidence:.2f}")
        
        # If no character is returned by predict_sign, it means no hand was detected
        elif predicted_char == "":
            no_hand_frame_count += 1 # Increment the counter
            
            # If the counter exceeds the threshold, add a space
            if no_hand_frame_count > SPACE_FRAME_THRESHOLD:
                # Add a space only if the last character isn't already a space
                if not detected_text or detected_text[-1] != ' ':
                    detected_text.append(' ')
                    print("--> Space added")
                no_hand_frame_count = 0 # Reset counter after adding space

        # Encode and yield the frame
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    cap.release()


def video_feed(request):
    return StreamingHttpResponse(generate_frames(), content_type='multipart/x-mixed-replace; boundary=frame')

def home(request):
    """Home page with ASL guide and search functionality"""
    return render(request, "home.html")

def feature(request):
    """Detection page with camera feed and real-time ASL detection"""
    global detected_text
    return render(request, "feature.html", {"output": ''.join(detected_text)})  # Show last 50 chars

def get_text(request):
    """API endpoint to get detected text"""
    global detected_text
    text = ''.join(detected_text[-50:])  # Get last 50 characters
    return JsonResponse({"text": text})

@csrf_exempt
@require_POST
def clear_text(request):
    """API endpoint to clear detected text"""
    global detected_text
    detected_text = []
    return JsonResponse({"success": True, "message": "Text cleared"})

def get_signs(request):
    """API endpoint to get all ASL signs as JSON"""
    try:
        # Get all signs from database
        signs = ASLSign.objects.all()
        
        print(f"Found {signs.count()} signs in database")  # Debug log
        
        # Optional: Add filtering by category
        category = request.GET.get('category')
        if category and category != 'all':
            signs = signs.filter(category=category)
            print(f"Filtered to {signs.count()} signs for category: {category}")
        
        # Optional: Add search functionality
        search = request.GET.get('search')
        if search:
            signs = signs.filter(
                models.Q(label__icontains=search)
            )
            print(f"Filtered to {signs.count()} signs for search: {search}")
        
        # Convert to list of dictionaries
        signs_data = []
        for sign in signs:
            image_url = ''
            if sign.image:
                image_url = sign.image.url
                print(f"Sign '{sign.label}' has image: {image_url}")  # Debug log
            else:
                print(f"Sign '{sign.label}' has no image")  # Debug log
                
            signs_data.append({
                'id': sign.id,
                'label': sign.label,
                'image_url': image_url,
                'category': sign.category,
            })
        
        print(f"Returning {len(signs_data)} signs")  # Debug log
        
        return JsonResponse({
            'signs': signs_data,
            'total': len(signs_data)
        })
        
    except Exception as e:
        print(f"Error in get_signs: {e}")  # Debug log
        return JsonResponse({
            'error': str(e),
            'signs': [],
            'total': 0
        }, status=500)