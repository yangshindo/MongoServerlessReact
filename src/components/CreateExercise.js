import React, { useState, useRef, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import swal from "sweetalert";
import * as Realm from "realm-web";
import TimePicker from "react-time-picker";
import { ExerciseDataContext } from "../contexts/ExerciseDataContext";

function CreateExercise() {
  //Context
  const { exerciseTypesList } = useContext(ExerciseDataContext);

  //Refs
  const usernameRef = useRef();
  const descriptionRef = useRef();
  const textRef = useRef();

  //States
  const [date, setDate] = useState("");
  const [userlist, setUserlist] = useState();
  const [startDuration, setStartDuration] = useState();
  const [endDuration, setEndDuration] = useState();

  //Fetch da lista de usuários MongoRealm
  useEffect(() => {
    async function fetchData() {
      const app = new Realm.App({ id: process.env.REACT_APP_MONGO_REALM_ID });
      const credentials = Realm.Credentials.anonymous();
      try {
        console.log("useEffect CALLED!");
        const user = await app.logIn(credentials);
        const fetchedUserList = await user.functions.userListHandler();
        setUserlist(fetchedUserList.slice(0, 20));
      } catch (err) {
        console.error("Failed to log in", err);
      }
    }
    fetchData();
  }, []);

  //Submit do form
  async function submitHandler(event) {
    event.preventDefault();
    const updatedUsername = usernameRef.current.value;
    const updatedDescription = descriptionRef.current.value;
    const updatedText = textRef.current.value;
    const fullDuration = `Start ${startDuration}h | End ${endDuration}h`;

    //formatando números fornecidos pelo react-timepicker da parte de horário.
    const numeric1 = Number(startDuration.replace(/\D/g, ""));
    const numeric2 = Number(endDuration.replace(/\D/g, ""));

    //definindo objeto exercise para posteriormente ser enviado para o backend/db
    let exercise = {
      username: updatedUsername,
      description: updatedDescription,
      duration: fullDuration,
      date: date.toLocaleString("pt-BR").split(" ")[0],
      text: updatedText,
    };

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
        user.functions.createExerciseHandler(exercise);
        console.log(exercise);
        swal("Exercise Added!");
        setTimeout(() => (window.location = "/"), 2500);
      }
    } catch (err) {
      console.error("Failed to log in", err);
    }
  }

  return (
    <div className="center">
      <h2>Create New Exercise Log</h2>
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
                  >
                    {userlist
                      ? userlist.map(function (user) {
                          return (
                            <option key={user} value={user}>
                              {user}
                            </option>
                          );
                        })
                      : null}
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
                      return (
                        <option key={exercise} value={exercise}>
                          {exercise}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <br />

                <div className="form-control">
                  <br />

                  <h5>
                    Start&nbsp;{" "}
                    <TimePicker
                      onChange={setStartDuration}
                      value={startDuration}
                      clockIcon={null}
                      disableClock={true}
                      clearIcon={null}
                    />{" "}
                    &nbsp;End&nbsp;{" "}
                    <TimePicker
                      onChange={setEndDuration}
                      value={endDuration}
                      clockIcon={null}
                      disableClock={true}
                      clearIcon={null}
                    />
                  </h5>
                  <br />

                  <hr className="bg-danger border-2 border-top border-dark"></hr>
                  <h5>Date </h5>
                  <DatePicker selected={date} onChange={(d) => setDate(d)} />
                  <br />
                  <br />
                </div>
                <label htmlFor="textarea" className="form-label">
                  Description
                </label>
                <input
                  ref={textRef}
                  type="text"
                  className="form-control"
                  id="textarea"
                  maxLength="45"
                  defaultValue=""
                ></input>
                <br />
                <input
                  type="submit"
                  value="Create Exercise Log"
                  className="btn btn-dark btn-lg"
                ></input>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateExercise;
