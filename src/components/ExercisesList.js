import React, { useState, useEffect } from 'react';
import ExerciseRender from './ExerciseRender'
import * as Realm from 'realm-web'
import swal from 'sweetalert'


function ExercisesList() {

    const [exerciselist, setExerciselist] = useState([])
    const [exerciseDescriptionsList, setExerciseDescriptionsList] = useState([])

    
    useEffect(() => {
    async function fetchData() {
    const app = new Realm.App({ id: process.env.REACT_APP_MONGO_REALM_ID });
    const credentials = Realm.Credentials.anonymous();
    try 
    {
        const user = await app.logIn(credentials);
        const newList = await user.functions.exercisesListHandler();
        setExerciselist(newList)
        const fetchedExerciseDescriptionsList = await user.functions.exerciseDescriptionsHandler();
        setExerciseDescriptionsList(fetchedExerciseDescriptionsList)
    } 
    catch(err) 
    {
  console.error("Failed to log in", err);}}


  fetchData()
}, [])


async function deleteExercise(id) {
    const app = new Realm.App({ id: process.env.REACT_APP_MONGO_REALM_ID });
    const credentials = Realm.Credentials.anonymous();
    try 
    {
        const user = await app.logIn(credentials);
        user.functions.deleteHandler(id);
        setExerciselist((prevValue) => {
        return prevValue.filter(ex => ex._id !== id)})
        swal(`Exercise id: ${id} deleted`)
    } 
    catch(err) 
    {
  console.error("Failed to log in", err);
}
}


    function createExercise(ex) {
        if (ex) {
        return (
            <ExerciseRender
            key= {ex._id}
            id= {ex._id}
            description={ex.description} 
            duration={ex.duration}
            date={ex.date}
            username={ex.username}
            onDelete={deleteExercise}
            style={ex.style}
            />
        )
        }
    }

    
    const mappedExerciseList = exerciselist.map(createExercise)
    
    return (
        <div>
            <ul>
                {mappedExerciseList.slice(0, 9)}
            </ul>
        </div>
    )
}

export default ExercisesList