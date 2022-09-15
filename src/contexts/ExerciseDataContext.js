import { useState, createContext } from "react";

export const ExerciseDataContext = createContext();

function ExerciseDataContextProvider(props) {
  const [exerciseData, setExerciseData] = useState();

  const value = { exerciseData, setExerciseData };

  return (
    <ExerciseDataContext.Provider value={value}>
      {props.children}
    </ExerciseDataContext.Provider>
  );
}

export default ExerciseDataContextProvider;
