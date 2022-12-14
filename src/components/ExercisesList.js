import React, { useState, useEffect, useContext } from 'react';
import * as Realm from 'realm-web'
import swal from 'sweetalert'
import { useNavigate } from "react-router-dom";

import { ExerciseDataContext } from "../contexts/ExerciseDataContext"
import ExerciseRender from './ExerciseRender'


function ExercisesList() {

    const [exerciselist, setExerciselist] = useState([])
    const { exerciseData, setExerciseData } = useContext(ExerciseDataContext)

    const navigate = useNavigate();
    
    useEffect(() => {
    async function fetchData() {
    const app = new Realm.App({ id: process.env.REACT_APP_MONGO_REALM_ID });
    const credentials = Realm.Credentials.anonymous();
    try 
    {
        const user = await app.logIn(credentials);
        const newList = await user.functions.exercisesListHandler();
        setExerciselist(newList)
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
        swal(`Exercise deleted`)
    } 
    catch(err) 
    {
  console.error("Failed to log in", err);
}
}

//a função não edita o exercício em si mas salva no context o objeto e então navega para a página de edição 
async function editExercise(id) {
    setExerciseData(exerciselist.filter(exercise => id === exercise._id))
    navigate("/edit")
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
            text={ex.text}
            onEdit={editExercise}
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