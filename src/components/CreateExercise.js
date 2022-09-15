import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import swal from "sweetalert";
import * as Realm from "realm-web";
import TimePicker from "react-time-picker";



function CreateExercise() {
  const usernameRef = useRef();
  const descriptionRef = useRef();
  const textRef = useRef()

  const [date, setDate] = useState("");
  const [userlist, setUserlist] = useState();
  const [exerciseDescriptionsList, setExerciseDescriptionsList] = useState();
  const [startDuration, setStartDuration] = useState();
  const [endDuration, setEndDuration] = useState();
  const [text, setText] = useState();

  useEffect(() => {
    async function fetchData() {
      const app = new Realm.App({ id: process.env.REACT_APP_MONGO_REALM_ID });
      const credentials = Realm.Credentials.anonymous();
      try {
        console.log("useEffect CALLED!");
        const user = await app.logIn(credentials);
        const fetchedUserList = await user.functions.userListHandler();
        setUserlist(fetchedUserList.slice(0, 20));
        const fetchedExerciseDescriptionsList =
          await user.functions.exerciseDescriptionsHandler();
        setExerciseDescriptionsList(fetchedExerciseDescriptionsList);
      } catch (err) {
        console.error("Failed to log in", err);
      }
    }
    fetchData();
  }, []);

  async function submitHandler(event) {
    event.preventDefault();
    const updatedUsername = usernameRef.current.value;
    const updatedDescription = descriptionRef.current.value;
    const updatedText = textRef.current.value;
    const fullDuration = `Start ${startDuration}h | End ${endDuration}h`;

    const numeric1 = Number(startDuration.replace(/\D/g, ""));
    const numeric2 = Number(endDuration.replace(/\D/g, ""));

    let exercise = {
      username: updatedUsername,
      description: updatedDescription,
      duration: fullDuration,
      date: date.toLocaleString("pt-BR").split(" ")[0],
      text: updatedText
    };

    const app = new Realm.App({ id: process.env.REACT_APP_MONGO_REALM_ID });
    const credentials = Realm.Credentials.anonymous();
    try {
      const user = await app.logIn(credentials);
      if (numeric1 > numeric2) {
        swal(
          "Error! Exercise start time is set to be after the ending time. Please make sure you set start and end times correctly."
        );
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
      <div class="shadow-lg">
      <form onSubmit={submitHandler}>
        <div className="form-group">
        <div>
          <div className="form-control">
            <div>
              <h5>Username</h5>
              <select className="form-select text-center" required ref={usernameRef}>
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
              <select className="form-select text-center" required ref={descriptionRef}>
                {exerciseDescriptionsList
                  ? exerciseDescriptionsList.map(function (exercise) {
                      return (
                        <option key={exercise.name} value={exercise.name}>
                          {exercise.name}
                        </option>
                      );
                    })
                  : null}
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

            <hr class="bg-danger border-2 border-top border-dark"></hr>
            <h5>Date </h5>
            <DatePicker  selected={date} onChange={(d) => setDate(d)} />
            <br />
            <br />

          </div>
          <label for="textarea" class="form-label">Description</label>
          <input ref={textRef} type="text" class="form-control" id="textarea" maxlength="45"></input>
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
