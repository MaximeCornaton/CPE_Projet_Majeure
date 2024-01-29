import React, {useEffect, useState} from "react";
import {
  Form,
  Header,
  Button,
  Message,
  Container,
  Segment,
  Label,
} from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, Link } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState({
    id: uuidv4(),
    img: null,
    login: "",
    email: "",
    pwd: "",
    repwd: "",
    loc: null,
  });

  const [error, setError] = useState(null); // État pour stocker le message d'erreur

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await getUserLocation();
        setCurrentUser({ ...currentUser, loc: location });
      } catch (error) {
        console.error("Error getting location:", error);
        setError("Error getting location.");
      }
    };

    fetchLocation();
  }, []);

  function processInput(event) {
    const target = event.currentTarget;
    const value = target.value;
    const name = target.name;

    let currentVal = currentUser;
    setCurrentUser({ ...currentUser, [name]: value });
    currentVal[name] = value;
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      // Obtenir l'extension du fichier
      const fileExtension = file.name.split(".").pop().toLowerCase();

      // Vérifier si l'extension est valide (png ou jpg)
      if (
        fileExtension !== "png" &&
        fileExtension !== "jpg" &&
        fileExtension !== "jpeg"
      ) {
        setError("Veuillez télécharger une image au format PNG ou JPG.");
        setCurrentUser({ ...currentUser, img: null }); // Réinitialiser l'image
        return;
      }

      reader.onloadend = () => {
        if (reader.result.length > 1000000) {
          setError("L'image dépasse la taille maximale autorisée");
          setCurrentUser({ ...currentUser, img: null }); // Réinitialiser l'image
        } else {
          setCurrentUser({ ...currentUser, img: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function submitOrder() {
    // Vérifier si les champs obligatoires sont remplis
    if (
      currentUser.login.trim() === "" ||
      currentUser.email.trim() === "" ||
      currentUser.pwd.trim() === "" ||
      currentUser.repwd.trim() === "" ||
      !currentUser.img
    ) {
      setError("Veuillez remplir tous les champs obligatoires");
    }
    // Vérifier si les pwd correspondent
    else if (currentUser.pwd === currentUser.repwd) {
      // Créer le user dans la BDD
      createUser();

      resetForm();
      setError(null); // Réinitialiser l'erreur s'il y en avait une avant
    } else {
      setError("Les mots de passe ne correspondent pas");
    }
  }

  function resetForm() {
    setError(null);
    setCurrentUser({
      id: "",
      img: null,
      login: "",
      email: "",
      pwd: "",
      repwd: "",
    });
  }

  const getUserLocation = async () => {
    return new Promise((resolve, reject) => {
      // Utiliser l'API de géolocalisation du navigateur
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
              // Récupérer les coordonnées de la position
              const { latitude, longitude } = position.coords;
              resolve({ latitude, longitude });
            },
            () => {
              reject("Impossible de récupérer la localisation de l'utilisateur.");
            }
        );
      } else {
        reject("La géolocalisation n'est pas supportée par le navigateur.");
      }
    });
  };

  const createUser = async () => {
    try {
      console.log("LOCCCCCCCCC", currentUser.loc);
      const response = await fetch("http://localhost/userservice/sendmsg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          userLogin: currentUser.login,
          userEmail: currentUser.email,
          userPwd: currentUser.pwd,
          userImg: currentUser.img,
          userLocation: currentUser.loc,
        }),
      });

      //console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container>
      <Segment>
        <Form>
          <Header as="h4" dividing>
            User registration
          </Header>

          <Form.Field required>
            <Form.Input
              fluid
              label="Login"
              placeholder="Login"
              name="login"
              onChange={processInput}
              value={currentUser.login}
            />
          </Form.Field>

          <Form.Field required>
            <Form.Input
              fluid
              label="E-mail"
              placeholder="E-mail"
              name="email"
              onChange={processInput}
              value={currentUser.email}
            />
          </Form.Field>

          <Form.Field required>
            <Form.Input
              type="password"
              label="Password"
              placeholder="Password"
              onChange={processInput}
              name="pwd"
              value={currentUser.pwd}
            />
          </Form.Field>

          <Form.Field required>
            <Form.Input
              type="password"
              label="Re-Password"
              placeholder="Re-Password"
              onChange={processInput}
              name="repwd"
              value={currentUser.repwd}
            />
          </Form.Field>

          <Form.Field required>
            <label>Avatar</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </Form.Field>

          {error && <Message negative>{error}</Message>}

          <Button type="reset" onClick={resetForm}>
            Cancel
          </Button>
          <Button type="submit" onClick={() => submitOrder(currentUser)}>
            OK
          </Button>
        </Form>

        <Message>
          Already registered? <Link to="/login">Login here</Link>
        </Message>
      </Segment>
    </Container>
  );
};

export default RegisterForm;
