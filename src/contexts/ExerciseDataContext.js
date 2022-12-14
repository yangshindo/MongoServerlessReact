import { useState, createContext } from "react";

export const ExerciseDataContext = createContext();

function ExerciseDataContextProvider(props) {
  const [exerciseData, setExerciseData] = useState();
  const exerciseTypesList = ["Run", "Swim", "Lift", "Bike", "Dance", "Climb"]

  const value = { exerciseData, setExerciseData, exerciseTypesList };

  return (
    <ExerciseDataContext.Provider value={value}>
      {props.children}
    </ExerciseDataContext.Provider>
  );
}

export default ExerciseDataContextProvider;
