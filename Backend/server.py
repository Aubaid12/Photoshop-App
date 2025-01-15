from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import base64
import numpy as np
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

@app.route('/filter', methods = ['GET', 'POST'])
def apply_filter():
    data = request.get_json()
    if "filter" not in data or "image" not in data:
        return jsonify({"message": "parameters missing"}), 400
   
    try: 
        base64_image = data["image"]
        client = MongoClient("mongodb://localhost:27017")
        db = client["Photoshop"]
        collection = db["Logs"]
        image_data = base64.b64decode(base64_image.split(",")[1])
        np_array = np.frombuffer(image_data,np.uint8)
        image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        
        ip_addr = request.remote_addr 
        
        if data["filter"] == "grayscale":
            processed_image = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
        elif data["filter"] == "cartoon":
            gray  =  cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            gray  =  cv2.medianBlur(gray, 5)
            edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 9)
            color = cv2.bilateralFilter(image, 9, 300, 300)
            processed_image = cv2.bitwise_and(color, color, mask=edges)
        elif data["filter"] == "sharpen":
            kernel = np.array([[0, -1, 0], [-1, 5,-1], [0, -1, 0]])
            processed_image = cv2.filter2D(image, -1, kernel)
        elif data["filter"] == "emboss":
            kernel = np.array([[-2, -1, 0], [-1, 1, 1], [0, 1, 2]])
            processed_image = cv2.filter2D(image, -1, kernel)
        elif data["filter"] == "threshold":
            _, processed_image = cv2.threshold(image, 127, 255, cv2.THRESH_BINARY)
        elif data["filter"] == "gaussian_blur":
            processed_image = cv2.GaussianBlur(image, (15, 15), 0)
        elif data["filter"] == "hsv":
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            processed_image = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
        elif data["filter"] == "canny":
            processed_image = cv2.Canny(image, 100, 200)
        elif data["filter"] == "emboss2":
            kernel = np.array([[-1, -1, 0], [-1, 1, 1], [0, 1, 1]])
            processed_image = cv2.filter2D(image, -1, kernel)
        elif data["filter"] == "vignette":
            rows, cols = image.shape[:2]
            X_resultant_kernel = cv2.getGaussianKernel(cols, cols / 3)
            Y_resultant_kernel = cv2.getGaussianKernel(rows, rows / 3)
            kernel = Y_resultant_kernel * X_resultant_kernel.T
            mask = kernel / kernel.max() 
            processed_image = np.copy(image)
            for i in range(3):  
                processed_image[:, :, i] = processed_image[:, :, i] * mask
                processed_image = np.uint8(np.clip(processed_image, 0, 255))
        elif data["filter"] == "sketch":
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            inverted = cv2.bitwise_not(gray)
            blurred = cv2.GaussianBlur(inverted, (111, 111), 0)
            processed_image = cv2.divide(gray, cv2.bitwise_not(blurred), scale=256.0)
        elif data["filter"] == "sepia":
            kernel = np.array([[0.393, 0.769, 0.189],
                       [0.349, 0.686, 0.168],
                       [0.272, 0.534, 0.131]])
            processed_image = cv2.transform(image, kernel)
            processed_image = np.clip(processed_image, 0, 255)  
        elif data["filter"] == "4r":
            rows, cols = image.shape[:2]
            processed_image = np.copy(image)
            for i in range(0, rows, 10):
                shift = np.random.randint(-20, 20)
                processed_image[i:i+10, :] = np.roll(processed_image[i:i+10, :], shift, axis=1)
            processed_image = np.uint8(np.clip(processed_image, 0, 255)) 
        elif data["filter"] == "flip_both":
            processed_image = cv2.flip(image, -1)  
    
        elif data["filter"] == "flip_vertical":
            processed_image = cv2.flip(image, 0)  
        elif data["filter"] == "flip_horizontal":
            processed_image = cv2.flip(image, 1) 
        elif data["filter"] == "transpose":
            processed_image = cv2.transpose(image)  
        elif data["filter"] == "negative":
            processed_image = cv2.bitwise_not(image)
        _,buffer_image = cv2.imencode(".jpeg", processed_image)
        collection.insert_one({"Status":"success","ip_address":ip_addr ,"filters_used":data["filter"]})
        processed_base64_image = base64.b64encode(buffer_image).decode("utf-8")
        return jsonify({"message": "image processed sucessfully", "image":f"data:image/jpeg;base64,{processed_base64_image}"}), 200  
    except Exception as e:
        print(e)
        collection.insert_one({"Status":"Error","Error_type":str(e) ,"ip_address":ip_addr ,"filters_used":data["filter"]})
        return jsonify({"message": "error while processing image"}), 500
            
            
app.run(debug=True)    

