import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Conv2D, MaxPooling2D, Flatten, Dropout
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from PIL import Image
import requests
from io import BytesIO


chemin_fichier_json = "C:\\Users\\Rapha\\Desktop\\scryfall_mtg_cards_feb_2023.json"

# Charger le fichier JSON dans un DataFrame
df = pd.read_json(chemin_fichier_json)

# Filtrer les lignes sans valeur dans les colonnes 'power' ou 'toughness'
df_filtered = df.dropna(subset=['power', 'toughness'])

# Prétraitement des données
img_size = 128
num_classes_power = len(df_filtered['power'].unique())
num_classes_toughness = len(df_filtered['toughness'].unique())

image_data = []
for _, row in df_filtered.iterrows():
    if 'normal' in row['image_uris']:
        url = row['image_uris']['normal']
        response = requests.get(url)
        try:
            img = Image.open(BytesIO(response.content)).resize((img_size, img_size))
            img_array = np.array(img) / 255.0
            image_data.append(img_array)
        except:
            pass

X = np.array(image_data)
num_samples = len(X)
batch_size = 64
num_batches = num_samples // batch_size * batch_size
X = X[:num_batches]

# Extraire les étiquettes de puissance (power) et de robustesse (toughness)
y_power, y_toughness = df_filtered['power'].values[:num_batches], df_filtered['toughness'].values[:num_batches]

# Encoder les étiquettes de puissance (power) et de robustesse (toughness) à l'aide de LabelEncoder
label_encoder_power, label_encoder_toughness = LabelEncoder(), LabelEncoder()
y_power_encoded, y_toughness_encoded = label_encoder_power.fit_transform(y_power), label_encoder_toughness.fit_transform(y_toughness)

# Diviser les données en ensembles d'entraînement et de test
X_train, X_test, y_power_train, y_power_test, y_toughness_train, y_toughness_test = train_test_split(
    X, y_power_encoded, y_toughness_encoded, test_size=0.2, random_state=42
)

# Convertir les étiquettes de puissance (power) et de robustesse (toughness) au format catégoriel
y_power_train_categorical = to_categorical(y_power_train, num_classes=num_classes_power)
y_toughness_train_categorical = to_categorical(y_toughness_train, num_classes=num_classes_toughness)

# Construire le modèle avec des couches de sortie distinctes pour power et toughness
input_layer = Input(shape=(img_size, img_size, 3))
conv_layer = Conv2D(32, (3, 3), activation='relu')(input_layer)
pooling_layer = MaxPooling2D((2, 2))(conv_layer)
flatten_layer = Flatten()(pooling_layer)

# Couches denses pour power avec dropout
dense_power = Dense(64, activation='relu')(flatten_layer)
dropout_power = Dropout(0.5)(dense_power)
output_power = Dense(num_classes_power, activation='softmax', name='power')(dropout_power)

# Couches denses pour toughness avec dropout
dense_toughness = Dense(64, activation='relu')(flatten_layer)
dropout_toughness = Dropout(0.5)(dense_toughness)
output_toughness = Dense(num_classes_toughness, activation='softmax', name='toughness')(dropout_toughness)

# # Couches denses pour power
# dense_power = Dense(64, activation='relu')(flatten_layer)
# output_power = Dense(num_classes_power, activation='softmax', name='power')(dense_power)

# # Couches denses pour toughness
# dense_toughness = Dense(64, activation='relu')(flatten_layer)
# output_toughness = Dense(num_classes_toughness, activation='softmax', name='toughness')(dense_toughness)

# Combiner les modèles
model = Model(inputs=input_layer, outputs=[output_power, output_toughness])

# Compiler le modèle avec des pertes séparées pour power et toughness
custom_optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
model.compile(optimizer=custom_optimizer,
              loss={'power': 'categorical_crossentropy', 'toughness': 'categorical_crossentropy'},
              metrics=['accuracy'])

# Entraîner le modèle
model.fit(X_train, {'power': y_power_train_categorical, 'toughness': y_toughness_train_categorical},
          epochs=10, batch_size=64, validation_split=0.2)

# Sauvegarder le modèle
model.save('C:\\Users\\Rapha\\Desktop\\my_model.keras')

# Évaluer le modèle
model.evaluate(X_test, {'power': to_categorical(y_power_test, num_classes=num_classes_power),
                        'toughness': to_categorical(y_toughness_test, num_classes=num_classes_toughness)})

# Chemin de l'image pour la prédiction
chemin_image = "https://images.jedessine.com/_uploads/_tiny_galerie/20130209/vign-ouioui-4fw_pp5.jpg"

# Charger et prétraiter l'image depuis l'URL
response = requests.get(chemin_image)
img = Image.open(BytesIO(response.content)).resize((img_size, img_size))
img_array = np.array(img) / 255.0
img_array = np.expand_dims(img_array, axis=0)

# Faire des prédictions
predictions = model.predict(img_array)

# Décoder les prédictions
predicted_power = label_encoder_power.inverse_transform([np.argmax(predictions[0])])[0]
predicted_toughness = label_encoder_toughness.inverse_transform([np.argmax(predictions[1])])[0]

# Afficher les résultats
print(f"Power prédit : {predicted_power}")
print(f"Toughness prédit : {predicted_toughness}")
