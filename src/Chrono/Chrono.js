import React, { useState, useEffect, useReducer } from "react";
import "./Chrono.css";
import PauseImg from "../Images/pause.svg";
import PlayImg from "../Images/play.svg";
import ResetImg from "../Images/reset.svg";

export default function Chrono() {
  // 1500 = nombre en secondes
  // Session en train de se dérouler
  const [sessionTime, setSessionTime] = useState(1500);
  // Temps fixé de la session
  const [sessionTimeFixed, setSessionTimeFixed] = useState(1500);

  // 300 = pause de 5 minutes
  const [breakTime, setBreakTime] = useState(300);
  const [breakTimeFixed, setBreakTimeFixed] = useState(300);

  const [workingChrono, setWorkingChrono] = useState(false);

  // Utiliser un reducer pour le setInterval dans le useEffect
  // si on utilise le useReducer dans le useEffect, on aura accès qu'à l'ancien state = bug d'interval
  // donc besoin d'appeler quelque chose qui aura accès au state neuf en dehors de ce useEffect -> useReducer
  const [state, dispatch] = useReducer(reducer);

  function reducer(state, action) {
    switch (action.type) {
      // Logique d'interval :
      case "TICK":
        if (sessionTime >= 0) {
          setSessionTime(sessionTime - 1);
        } else if (breakTime >= 1) {
          setBreakTime(breakTime - 1);
        } else if (breakTime <= 0 && breakTime <= 0) {
          // reset des intervals
          setSessionTime(sessionTimeFixed);
          setBreakTime(breakTimeFixed);
        }
        break;
      default:
        return state;
    }
  }

  // useEffet s'exécute à chaque fois que workingChrono est toggle
  useEffect(() => {
    // faire une let = id car chaque setInterval retourne un id
    let id;

    // Création d'un interval si workingChrono est sur true
    if (workingChrono) {
      id = window.setInterval(() => {
        // utilisation du reducer défini plus haut (en dehors du useEffect)
        dispatch({ type: "TICK" });
      }, 1000);
    }

    // tjs nettoyer pour éviter boucle infinie, surtout avec setInterval, il faut une cleanup function : appelée avec un return
    // Si on supprime le composant, la cleanup function sera retournée
    return () => {
      window.clearInterval(id);
    };
  }, [workingChrono]);

  const PlayPause = () => {
    setWorkingChrono(!workingChrono);
  };
  // console.log(workingChrono);

  const handleSession = (e) => {
    const el = e.target;

    if (el.classList.contains("minus")) {
      // si on appuie sur 'minus' et qu'on est au-dessus de 1, on va faire -60
      if (sessionTime / 60 > 1) {
        setSessionTime(sessionTime - 60);
        setSessionTimeFixed(sessionTimeFixed - 60);
      }
    } else if (el.classList.contains("plus")) {
      //
      setSessionTime(sessionTime + 60);
      setSessionTimeFixed(sessionTimeFixed + 60);
    }
  };

  const handleBreak = (e) => {
    const el = e.target;

    if (el.classList.contains("minus")) {
      // si on appuie sur 'minus' et qu'on est au-dessus de 1, on va faire -60
      if (breakTime / 60 > 1) {
        setBreakTime(breakTime - 60);
        setBreakTimeFixed(breakTimeFixed - 60);
      }
    } else if (el.classList.contains("plus")) {
      //
      setBreakTime(breakTime + 60);
      setBreakTimeFixed(breakTimeFixed + 60);
    }
  };

  const resteFunc = () => {

    // si workingChrono est en cours, on l'arrête et inverse
    if (workingChrono) {
      setWorkingChrono(!workingChrono);
    }
    // et on remet à 0 avec :
    setSessionTime(sessionTimeFixed);
    setBreakTime(breakTimeFixed);
  };

  return (
    <div className={workingChrono ? "container-chrono anim-glow" : "container-chrono"}>
      <div className="container-config">
        <div className="box-btns session">
          <button className="minus" onClick={handleSession}>
            -
          </button>
          <span>{sessionTimeFixed / 60}</span>
          <button className="plus" onClick={handleSession}>
            +
          </button>
        </div>

        <div className="box-btns break">
          <button className="minus" onClick={handleBreak}>
            -
          </button>
          <span>{breakTimeFixed / 60}</span>
          <button className="plus" onClick={handleBreak}>
            +
          </button>
        </div>
      </div>

      <h1>
        {sessionTime >= 0 ? (
          // Math.trunc(sessionTime / 60) = enlever tous les chiffres après la virgule
          // ${sessionTime % 60} = reste de la division, si c'est < 10, on veut mettre un 0 pour voir 09,08,07 etc...
          // 1ere partie : minute
          // 2eme partie : seconde mais on veut tjs voir un 0 avant le 9, 8 etc... donc :
          <span>
            {`${Math.trunc(sessionTime / 60)} : ${
              sessionTime % 60 < 10
                ? `0${sessionTime % 60}`
                : `${sessionTime % 60}`
            }`}
          </span>
        ) : (
          <span>
            {`${Math.trunc(breakTime / 60)} : ${
              breakTime % 60 < 10 ? `0${breakTime % 60}` : `${breakTime % 60}`
            }`}
          </span>
        )}
      </h1>

      <div className="container-controllers">
        <button onClick={PlayPause}>
          <img src={workingChrono ? PauseImg : PlayImg} alt="icône play" />
        </button>
        <button onClick={resteFunc}>
          <img src={ResetImg} alt="icône reset" />
        </button>
      </div>
    </div>
  );
}
