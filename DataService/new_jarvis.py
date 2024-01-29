import speech_recognition as sr
import requests
import g4f

# Fonction pour récupérer les infos du user avec son ID
def get_user_info(userID):

    url_backend_java = f"http://localhost/userservice/user/{userID}"

    try:
        # Envoyer la requête GET au backend Java
        response = requests.get(url_backend_java)

        # Vérifier si la requête a réussi 
        if response.status_code == 200:
            # Récupérer la réponse JSON
            reponse_json = response.json()

            return reponse_json

        elif response.status_code == 404:
            # Si l'utilisateur n'est pas trouvé
            print("Utilisateur non trouvé")
            return None

        else:
            # En cas d'échec de la requête, imprimer le code d'erreur HTTP
            print(f"Échec de la requête avec le code d'erreur {response.status_code}")

    except Exception as e:
        print(f"Une erreur s'est produite : {e}")

# Fonction pour récupérer les matchs du user avec son ID
def get_user_match(user_id):

    url = "http://localhost/matchservice/getMatches"

    # Envoyer de la requête POST
    response = requests.post(url, data=user_id)

    # Vérification du statut de la réponse
    if response.status_code == 200:

        users = response.json()
        
        return users
    else:
        # Affichage d'une erreur en cas de problème avec la requête
        print(f"Erreur lors de la requête : {response.status_code}")
        return None
        
# Fonction permettant de créer le texte contenant les infos des joueurs, puis de le donner à l'IA
def analyse_chance(user_info, list_match):
    phrase = ""

    # Pour tous les adversaires
    for opponent in list_match:
        print(f"\nuser identifié : {opponent['userLogin']}")
        phrase += f" L'adversaire {opponent['userLogin']} possède une attaque de {opponent['userAttack']} et {opponent['userHp']} points de vie." 

    phrase += f" Moi je possède une attaque de {user_info['userAttack']} et {user_info['userHp']} points de vie."
    phrase += f" Pour les adversaires que je viens de mentionner à l'instant, contre qui ai-je le plus de chance de gagner ? Compare notre attaque et nos points de vie."
    phrase += f" Donne moi une estimation de la probabilité que je gagne, sans faire de calculs."
    phrase += f" Quels conseils peux-tu me donner pour mon combat ? Les combats se font uniquement avec les poings." 
    phrase += f" Réponds à ces questions en français, juste en faisant des phrases courtes et en me vouvoyant."

    response = "Bonjour Monsieur, voici mon analyse. "
    response += g4f.ChatCompletion.create(
        model="gpt-3.5-turbo",
        provider=g4f.Provider.GeekGpt,
        messages=[{"role": "user", "content": phrase}],
        stream=False,
    )

    # Remplacer les caractéres indésirables dans le texte
    response = response.replace('*', '').replace('-', '')
    return response



def main(userID, recommendUserID, question):

    user_info = get_user_info(userID)
    opponent_showed = get_user_info(recommendUserID)
    list_match = get_user_match(userID)

    mots = question.split()

    for elem in mots :
        if elem in ["face", "contre", "lui", "elle"]:
            response =  analyse_chance(user_info, [opponent_showed]) # analyser l'adversaire affiché devant nous dans la page de swipe
            return response
        elif elem in ["match"]:
            response = analyse_chance(user_info, list_match)  # analyser tous les adversaires avec qui on a eu un match
            return response
    
    return "Désolé monsieur mais je ne peux pas traiter votre demande."
            
