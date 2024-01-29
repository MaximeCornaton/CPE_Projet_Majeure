from flask import Flask, jsonify, request
from ML.prediction_utils import prediction
from Frame.frame_utils import add_frame
from new_jarvis import main

app = Flask(__name__)

# Fonction permettant de donner une attaques et points de vies en fonction de la photo
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    image_base64 = data['image_base64']

    result = prediction(image_base64)

    return jsonify(result)

# Fonction permettant de donner un cadre à l'avatar en fonction du niveau
@app.route('/get_frame', methods=['POST'])
def get_frame():
    data = request.get_json()
    niveau = data['level']
    image_base64 = data['image_base64']

    result = add_frame(image_base64, niveau)

    return jsonify(result)

# Fonction permettant de récupérer l'analyse faites par l'IA
@app.route('/jarvis', methods=['POST'])
def get_voice():
    try:
        data = request.get_json()

        question = data['message']
        userID = data['userID']
        recommendUserID = data['recommendUserID']

        message = main(userID, recommendUserID, question)
    
        return jsonify({'message': message})

    except Exception as e:
        print(f"Erreur dans la fonction get_voice : {str(e)}")
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True)


