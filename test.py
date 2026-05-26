import cv2
import mediapipe as mp
import os
import uuid

# Setup MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1)
mp_draw = mp.solutions.drawing_utils

# Setup base directory
save_dir = 'dataset'
os.makedirs(save_dir, exist_ok=True)

# Get label input once
label = input("🔤 Enter the character/label for this hand sign (A-Z or 0-9): ").upper()
label_dir = os.path.join(save_dir, label)
os.makedirs(label_dir, exist_ok=True)

# Camera setup
cap = cv2.VideoCapture(0)
offset = 30
image_count = 0
max_images = 300

print(f"📸 Collecting 100 images for label: {label}. Press ESC to exit early.")

while image_count < max_images:
    success, frame = cap.read()
    if not success:
        print("❌ Failed to grab frame")
        break

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            h, w, _ = frame.shape
            x_min, y_min = w, h
            x_max, y_max = 0, 0

            for lm in hand_landmarks.landmark:
                x, y = int(lm.x * w), int(lm.y * h)
                x_min = min(x_min, x)
                y_min = min(y_min, y)
                x_max = max(x_max, x)
                y_max = max(y_max, y)

            # Apply offset and clamp to frame bounds
            x_min = max(0, x_min - offset)
            y_min = max(0, y_min - offset)
            x_max = min(w, x_max + offset)
            y_max = min(h, y_max + offset)

            # Draw bounding box
            cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)

            # Crop, resize, and save
            hand_crop = frame[y_min:y_max, x_min:x_max]
            try:
                hand_crop = cv2.resize(hand_crop, (64, 64))
                filename = os.path.join(label_dir, f"{uuid.uuid4().hex}.jpg")
                cv2.imwrite(filename, hand_crop)
                image_count += 1
                print(f"✅ [{image_count}/{max_images}] Saved to {filename}")
            except Exception as e:
                print(f"⚠️ Could not resize/save: {e}")

            cv2.imshow("Hand Crop", hand_crop)

    cv2.imshow("Live Feed", frame)
    if cv2.waitKey(1) & 0xFF == 27:
        print("🛑 Exit requested.")
        break

print(f"🎉 Done! Collected {image_count} images for label '{label}'")
cap.release()
cv2.destroyAllWindows()