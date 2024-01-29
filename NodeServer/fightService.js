// fightService.js

import axios from "axios";
import Chronometer from "./chronometer.js";

const { chronometer1, chronometer2 } = initFightTimers();

async function getUserData(sender) {
  try {
    const response = await fetch(`http://localhost/userservice/user/${sender}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données");
    }
    const data = await response.json();

    console.log("Received user :", data);

    return data;
  } catch (error) {
    console.error("Erreur :", error);
    throw error;
  }
}

function processEvent(fighter1, fighter2, action, userID) {
  let actionValidity = true;
  console.log("fighter", action)

  if (fighter1.userId == userID) {
    if (action == "right punch" || action == "left punch") {
      if (chronometer1.isRunning() == false) {
        chronometer1.start();
      }
      
      console.log ('time ', chronometer1.isRunning(), chronometer1.getTime() )
      if (chronometer1.isRunning() == true && chronometer1.getTime() > 1000){
        console.log(fighter2)
        if((fighter2.blocking == false) || (action == "right punch" && fighter2.dodging_right == false) || (action == "left punch" && fighter2.dodging_left == false)){
          fighter2.userHp = fighter2.userHp - fighter1.userAttack*0.1;
          console.log("pass", fighter1.userHp)
        }
        fighter1.userEndurance = fighter1.userEndurance - 10;
        chronometer1.reset();
      } else {
        actionValidity = false;
      }
    }

    if (action == "block") {
      fighter1.blocking = true;
    }
    if (action == "end block") {
      fighter1.blocking = false;
    }
    if (action == "right dodge") {
      fighter1.dodging_right = true;
    }
    if (action == "left dodge") {
      fighter1.dodging_left = true;
    }
    if (action == "end right dodge") {
      fighter1.dodging_right = false;
    }
    if (action == "end left dodge") {
      fighter1.dodging_left = false;
    }
  }

  if (fighter2.userId == userID) {
    if (action == "right punch" || action == "left punch") {
      if (chronometer2.isRunning() == false) {
        chronometer2.start();
      }
      
      if (chronometer2.isRunning() == true && chronometer2.getTime() > 1000){
        if((fighter1.blocking == false) || (action == "right punch" && fighter1.dodging_right == false) || (action == "left punch" && fighter1.dodging_left == false)){
          fighter1.userHp = fighter1.userHp - fighter2.userAttack*0.2;
          console.log("pass", fighter1.userHp)
        }
        fighter2.userEndurance = fighter2.userEndurance - 10;
        chronometer2.reset();
      } else {
        actionValidity = false;
      }
    }

    if (action == "block") {
      fighter2.blocking = true;
    }
    if (action == "end block") {
      fighter2.blocking = false;
    }
    if (action == "right dodge") {
      fighter2.dodging_right = true;
    }
    if (action == "left dodge") {
      fighter2.dodging_left = true;
    }
    if (action == "end right dodge") {
      fighter2.dodging_right = false;
    }
    if (action == "end left dodge") {
      fighter2.dodging_left = false;
    }
  }

  if(fighter1.userHp <= 0 || fighter2.userHp <= 0){
    console.log('END')
    let val_bool = true
    return { fighter1, fighter2, actionValidity, val_bool };
  }
  let val_bool = false
  return { fighter1, fighter2, actionValidity, val_bool };
}

// id, attack, hp, endurance,xp,level

// - Toutes les 1 secondes, les joueurs ont le droit de donner un coup. Il n'y a pas d'ordre d'attaque. Les PV enlevés sont égaux à l'attaque
// - Donner un coup consomme 10 d'endurance
// - Pour ne pas perdre des PV, on peut soit éviter le coup, soit bloquer en se mettant en garde
// - Eviter permet d'esquiver à droite ou à gauche, bloquer permet de parer n'importe quel coup (droite ou gauche)
// - Eviter consomme 5 d'endurances, et bloquer coûte 10
// - L'endurance se régénère de +5 toutes les 3 secondes

function initFightTimers() {
  const chronometer1 = new Chronometer();
  const chronometer2 = new Chronometer();
  return { chronometer1, chronometer2 };
}

function sendResults(userID){

  const xpData = '100';
  
  axios.put(`http://localhost/userservice/user/${userID}`, xpData)
    .then(response => {
      console.log('Response:', response.data);
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
  

  return
}

export { getUserData, processEvent, sendResults};
