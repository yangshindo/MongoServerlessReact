import React, { useState, useRef , useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import swal from 'sweetalert';
import * as Realm from 'realm-web'
import TimePicker from 'react-time-picker';


function CreateExercise() {

    const usernameRef = useRef()
    const descriptionRef = useRef()

    const [date, setDate] = useState("")
    const [userlist, setUserlist] = useState()
    const [exerciseDescriptionsList, setExerciseDescriptionsList] = useState()
    const [startDuration, setStartDuration] = useState()
    const [endDuration, setEndDuration] = useState()


    useEffect(() => {
        async function fetchData() {
            const app = new Realm.App({ id: process.env.REACT_APP_MONGO_REALM_ID });
        const credentials = Realm.Credentials.anonymous();
        try 
        {
            console.log("useEffect CALLED!")
            const user = await app.logIn(credentials);
            const fetchedUserList = await user.functions.userListHandler();
            setUserlist(fetchedUserList.slice(0,20))
            const fetchedExerciseDescriptionsList = await user.functions.exerciseDescriptionsHandler();
            setExerciseDescriptionsList(fetchedExerciseDescriptionsList)
        } 
        catch(err) 
        {
      console.error("Failed to log in", err);
        }}
        fetchData();
    }, [])
    
    
    async function submitHandler(event) {
        event.preventDefault()
        const updatedUsername = usernameRef.current.value
        const updatedDescription = descriptionRef.current.value
        const fullDuration = `Start ${startDuration}h | End ${endDuration}h`



        const numeric1 = Number(startDuration.replace(/\D/g,''))
        const numeric2 = Number(endDuration.replace(/\D/g,''))

   


        let exercise= {
            username: updatedUsername,
            description: updatedDescription,
            duration: fullDuration,
            date: date.toLocaleString("pt-BR").split(' ')[0],
        }





        
        const app = new Realm.App({ id: process.env.REACT_APP_MONGO_REALM_ID });
        const credentials = Realm.Credentials.anonymous();
        try 
        {
            
            const user = await app.logIn(credentials);
            if (numeric1 > numeric2) {
                swal("Error! Exercise start time is set to be after the ending time. Please make sure you set start and end times correctly.")}
                else {
                    if (exercise.description === "Run 🏃") {
                        exercise.style = "https://i.imgur.com/cYNjll3.jpg"
                    }
                    else if (exercise.description === "Dance 💃") {
                        exercise.style = "https://i.imgur.com/adHtKG8.jpg"}
                    else if (exercise.description === "Swim 🏊") {
                        exercise.style = "https://i.imgur.com/hCYZD92.jpg"}
                    else if (exercise.description === "Lift 🏋") {
                        exercise.style = "https://i.imgur.com/xnEAP8H.jpg"}
                    else if (exercise.description === "Bike 🚴️") {
                        exercise.style = "https://i.imgur.com/kMLpoMi.jpg"}
                    else if (exercise.description === "Climb 🧗") {
                        exercise.style = "https://i.imgur.com/Jepp0Lx.jpg"}
            user.functions.createExerciseHandler(exercise);
            console.log(exercise)
            swal("Exercise Added!");
            setTimeout(() => window.location = "/", 2500);}
        } 
        catch(err) 
        {
            console.error("Failed to log in", err);}
        }

   

        

      
       



    return (
        <div>
            <div className="container">
            <div className="card">
            <h3>Create New Exercise Log</h3>
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label>Username: </label>
                    <select required className="form-control" ref={usernameRef}>
                    {userlist ? userlist.map(function(user) {
                        return <option
                        key={user}
                        value={user}>{user}
                        </option>;
                    }) : null}
                    </select>
                </div>
                <br />
               <div className="form-group">
                    <label>Exercise Type: </label>
                    <select required className="form-control" ref={descriptionRef}>
                    {exerciseDescriptionsList ? exerciseDescriptionsList.map(function(exercise) {
                        return <option
                        key={exercise.name}
                        value={exercise.name}>{exercise.name}
                        </option>;
                    }) : null}
                    </select>
                </div>
                <div className="form-group">
<br />
Start&nbsp;&nbsp; <TimePicker onChange={setStartDuration} value={startDuration} clockIcon={null} disableClock={true} clearIcon={null}/>
&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; End&nbsp;&nbsp; <TimePicker onChange={setEndDuration} value={endDuration} clockIcon={null} disableClock={true} clearIcon={null}/>
<br />
<br />
</div>
                <div className="form-group">
                    <label>Date: </label>
                    <DatePicker selected={date} onChange={(d) => setDate(d)} />
                </div>
                <br />
                <br />
                <div className="form-group">
                    <input type="submit" value="Create Exercise Log" className="btn btn-dark"></input>
                </div>
            </form>
        </div>
        </div>
        </div>
    )
}



export default CreateExercise
