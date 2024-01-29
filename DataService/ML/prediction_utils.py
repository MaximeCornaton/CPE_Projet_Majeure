from PIL import Image
import numpy as np
import io
import base64
from tensorflow.keras.models import load_model

# Charger le modèle
chemin_modele = "ML/my_model_dropout05.keras"
model = load_model(chemin_modele)

# Définir la taille de l'image
img_size = 128

def prediction(image_base64): 
    # Décoder l'image base64
    image_data = base64.b64decode(image_base64.split(',')[1])
    
    # Ouvrir l'image et la convertir en RGB
    image = Image.open(io.BytesIO(image_data)).convert('RGB')
    image = image.resize((img_size, img_size))
    
    # Convertir l'image en tableau numpy normalisé
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Faire des prédictions
    predictions = model.predict(img_array)

    # Décoder les prédictions
    predicted_power = int(np.argmax(predictions[0]))
    predicted_toughness = int(np.argmax(predictions[1]))

    return {
        'userAttack': predicted_power,
        'userHp': predicted_toughness
    }
