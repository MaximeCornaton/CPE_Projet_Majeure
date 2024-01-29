from PIL import Image, ImageOps, ImageDraw
import io
import base64

# Fonction permettant d'ajouter un cadre à l'avatar selon son niveau
def add_frame(image_data, niveau):
    niveau = int(niveau)

    if niveau <= 10:
        color = 'brown'
        if niveau < 5:
            cadre = 'low'
        elif niveau < 10:
            cadre = 'med'
        elif niveau == 10:
            cadre = 'max'
    elif niveau <= 20:
        color = 'silver'
        if niveau < 15:
            cadre = 'low'
        elif niveau < 20:
            cadre = 'med'
        elif niveau == 20:
            cadre = 'max'
    elif niveau <= 30:
        color = 'gold'
        if niveau < 25:
            cadre = 'low'
        elif niveau < 30:
            cadre = 'med'
        elif niveau == 30:
            cadre = 'max'
    elif niveau <= 40:
        color = 'white'
        if niveau < 35:
            cadre = 'low'
        elif niveau < 40:
            cadre = 'med'
        elif niveau == 40:
            cadre = 'max'
    elif niveau <= 50:
        diamant = (200, 200, 255) 
        if niveau < 45:
            cadre = 'low'
        elif niveau < 50:
            cadre = 'med'
        elif niveau == 50:
            cadre = 'max'
        color = diamant
    elif niveau > 50:
        diamant = (200, 200, 255) 
        cadre = 'max'
        color = diamant

    # Définir la taille du cadre en pixels
    taille_cadre = 50

    # Décoder l'image base64
    image_data = base64.b64decode(image_data.split(',')[1])

    # Ouvrir l'image et la convertir en RGB
    image = Image.open(io.BytesIO(image_data)).convert('RGB')

    # Ajouter le cadre
    image_avec_cadre = ImageOps.expand(image, border=taille_cadre, fill=color)

    # Créer une nouvelle image avec ou sans lignes selon le niveau
    if cadre == 'med' or cadre == 'max':
        # Créer une nouvelle image plus grande
        nouvelle_largeur = image_avec_cadre.width + 3 * taille_cadre
        nouvelle_hauteur = image_avec_cadre.height + 3 * taille_cadre
        nouvelle_image = Image.new("RGBA", (nouvelle_largeur, nouvelle_hauteur), (0, 0, 0, 0))

        # Placer l'image avec le cadre au centre de la nouvelle image
        position = (taille_cadre, taille_cadre)
        nouvelle_image.paste(image_avec_cadre, position)

        # Créer un objet Draw pour dessiner sur la nouvelle image
        draw = ImageDraw.Draw(nouvelle_image)

        # Dessiner des lignes aux coins
        for corner in [(taille_cadre, taille_cadre),
                       (taille_cadre, image_avec_cadre.height + taille_cadre),
                       (image_avec_cadre.width + taille_cadre, taille_cadre),
                       (image_avec_cadre.width + taille_cadre, image_avec_cadre.height + taille_cadre)]:

            x, y = corner
            end_x1, end_y1 = x + taille_cadre, y - taille_cadre
            end_x2, end_y2 = x - taille_cadre, y + taille_cadre

            draw.line([(x, y), (end_x1, end_y1)], fill=color, width=20)
            draw.line([(x, y), (end_x2, end_y2)], fill=color, width=20)
            draw.line([(x, y), (end_x1, end_y2)], fill=color, width=20)
            draw.line([(x, y), (end_x2, end_y1)], fill=color, width=20)

        if cadre == 'max':
            # Dessiner des lignes sur les côtés
            for side in [(taille_cadre, taille_cadre + image_avec_cadre.height // 2),
                         (taille_cadre + image_avec_cadre.width // 2, taille_cadre),
                         (taille_cadre + image_avec_cadre.width, taille_cadre + image_avec_cadre.height // 2),
                         (taille_cadre + image_avec_cadre.width // 2, taille_cadre + image_avec_cadre.height)]:

                x, y = side
                end_x1, end_y1 = x + taille_cadre, y - taille_cadre
                end_x2, end_y2 = x - taille_cadre, y + taille_cadre

                draw.line([(x, y), (end_x1, end_y1)], fill=color, width=20)
                draw.line([(x, y), (end_x2, end_y2)], fill=color, width=20)
                draw.line([(x, y), (end_x1, end_y2)], fill=color, width=20)
                draw.line([(x, y), (end_x2, end_y1)], fill=color, width=20)

        # Encodage en base64 de nouvelle_image
        buffered_nouvelle_image = io.BytesIO()
        nouvelle_image.save(buffered_nouvelle_image, format="PNG")
        image_base64_nouvelle_image = "data:image/png;base64," + base64.b64encode(buffered_nouvelle_image.getvalue()).decode('utf-8')

        # Retourner les résultats au format JSON
        result = {
            'image_base64': image_base64_nouvelle_image
        }

    else:
        # Encodage en base64 de image_avec_cadre
        buffered_image_avec_cadre = io.BytesIO()
        image_avec_cadre.save(buffered_image_avec_cadre, format="PNG")
        image_base64_avec_cadre = "data:image/png;base64," + base64.b64encode(buffered_image_avec_cadre.getvalue()).decode('utf-8')

        # Retourner les résultats au format JSON
        result = {
            'image_base64': image_base64_avec_cadre
        }

    return result
