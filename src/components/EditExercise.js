import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import swal from "sweetalert";
import * as Realm from "realm-web";
import TimePicker from "react-time-picker";
import { ExerciseDataContext } from "../contexts/ExerciseDataContext";


function CreateExercise() {
  

  //Navigate
  const navigate = useNavigate()

  //Context
  const { exerciseTypesList, exerciseData } =
    useContext(ExerciseDataContext);

  //Refs
  const usernameRef = useRef();
  const descriptionRef = useRef();
  const textRef = useRef();

  //Alterando Refs de acordo com dados salvos no Context

  //States
  const [date, setDate] = useState("");
  const [startDuration, setStartDuration] = useState("");
  const [endDuration, setEndDuration] = useState("");
  const [timeSwitch, setTimeSwitch] = useState(false);
  const [dateSwitch, setDateSwitch] = useState(false);

  //Função Submit do form
  async function submitHandler(event) {
    event.preventDefault();

    //formatando números fornecidos pelo react-timepicker da parte de horário.
    const numeric1 = Number(startDuration.replace(/\D/g, ""));
    const numeric2 = Number(endDuration.replace(/\D/g, ""));

    //recebe tempo de início e tempo de fim da atividade providos pelos dois campos do react-time-picker e converte em string
    let fullDuration = `Start ${startDuration}h | End ${endDuration}h`;
    //utiliza a duração provida pelo context caso o usuário não clique no botão de alterar a duração
    if (!timeSwitch) {
      fullDuration = exerciseData[0].duration;
    }


    //formatando data
    let fullDate = date.toLocaleString("pt-BR").split(" ")[0]
    //utiliza a data provida pelo context caso o usuário não clique no botão de alterar a data
    if (!dateSwitch) {
      fullDate = exerciseData[0].date;
    }


    //construção do objeto exercise para posteriormente enviar ao backend e gravar na db
    let exercise = {
      _id: exerciseData[0]._id,
      username: usernameRef.current.value,
      description: descriptionRef.current.value,
      duration: fullDuration,
      date: fullDate,
      text: textRef.current.value,
    };
    

    //operação do MongoRealm
    const app = new Realm.App({ id: process.env.REACT_APP_MONGO_REALM_ID });
    const credentials = Realm.Credentials.anonymous();
    try {
      const user = await app.logIn(credentials);
      //assegura que o horário de começo e fim do exercício provido pelo usuário seja correto
      if (numeric1 > numeric2) {
        swal(
          "Error! Exercise start time is set to be after the ending time. Please make sure you set start and end times correctly."
        );

      //coloca a imagem correta na propriedade style, que varia de acordo com o tipo de exercício
      } else {
        if (exercise.description === "Run") {
          exercise.style = "https://i.imgur.com/cYNjll3.jpg";
        } else if (exercise.description === "Dance") {
          exercise.style = "https://i.imgur.com/adHtKG8.jpg";
        } else if (exercise.description === "Swim") {
          exercise.style = "https://i.imgur.com/hCYZD92.jpg";
        } else if (exercise.description === "Lift") {
          exercise.style = "https://i.imgur.com/xnEAP8H.jpg";
        } else if (exercise.description === "Bike") {
          exercise.style = "https://i.imgur.com/kMLpoMi.jpg";
        } else if (exercise.description === "Climb") {
          exercise.style = "https://i.imgur.com/Jepp0Lx.jpg";
        }
        user.functions.updateExercise(exercise._id, exercise);


        swal("Exercise updated!");
        setTimeout(() => (navigate("/")), 2500);
      }
    } catch (err) {
      console.error("Failed to log in", err);
    }
  }

  return (
    <div className="center">
      <h2>Edit Exercise</h2>
      <br />
      <div className="shadow-lg">
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <div>
              <div className="form-control">
                <div>
                  <h5>Username</h5>
                  <select
                    className="form-select text-center"
                    required
                    ref={usernameRef}
                    disabled
                  >
                    <option>
                      {exerciseData[0] ? exerciseData[0].username : null}
                    </option>
                  </select>
                </div>
                <br />
                <div>
                  <h5>Exercise Type </h5>
                  <select
                    className="form-select text-center"
                    required
                    ref={descriptionRef}
                  >
                    {exerciseTypesList.map(function (exercise) {
                      //definindo qual option vai ganhar atributo selected baseado na exerciseData do Context
                      let isselected = false;
                      if (exercise === exerciseData[0].description) {
                        isselected = true;
                      }
                      //retorna todos os tipos de exercício com o exercício anterior selecionado
                      return (
                        <option key={exercise} value={exercise} selected={isselected}>
                          {exercise}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <br />

                <div className="form-control">
                  <br />
                  {timeSwitch ? (
                    <div>
                      <h5>
                        Start&nbsp;{" "}
                        <TimePicker
                          onChange={setStartDuration}
                          value={startDuration}
                          clockIcon={null}
                          disableClock={true}
                          clearIcon={null}
                          required={true}
                        />{" "}
                        &nbsp;End&nbsp;{" "}
                        <TimePicker
                          onChange={setEndDuration}
                          value={endDuration}
                          clockIcon={null}
                          disableClock={true}
                          clearIcon={null}
                          required={true}
                        />
                      </h5>
                    </div>
                  ) : (
                    <div>
                      <p class="h6">
                        Current exercise duration is: <br />{" "}</p>
                        <p>{exerciseData[0].duration}.</p>
                      <button
                        button
                        type="button"
                        class="btn btn- btn-outline-dark"
                        onClick={() => setTimeSwitch(true)}
                      >
                        Change Duration
                      </button>
                    </div>
                  )}
                  <br />
                
 {dateSwitch ?   <div><h5>Date </h5>
                    <DatePicker required="true" selected={date} onChange={(d) => setDate(d)} />
                    <br />
                    <br />
                  </div> : <div>
                      <p class="h6">
                        Current exercise scheduled date is: </p>
                        <p>{exerciseData[0].date}.</p>
                      <button
                        button
                        type="button"
                        class="btn btn- btn-outline-dark"
                        onClick={() => setDateSwitch(true)}
                      >
                        Change Date
                      </button>
                    </div>}
                  <div>
                    <br />
                    <br />
                  
                  <label htmlFor="textarea" className="form-label">
                    Description
                  </label>
                  <input
                    ref={textRef}
                    type="text"
                    className="form-control"
                    id="textarea"
                    maxLength="35"
                    defaultValue={exerciseData[0].text}
                  ></input>
                </div>
                <br />
                <input
                  type="submit"
                  value="Confirm Changes"
                  className="btn btn-dark btn-lg"
                ></input>
              </div>
            </div>
          </div>
          </div>
        </form>
      </div>
    </div>
    
  );
}

export default CreateExercise;
