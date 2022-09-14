import React from 'react'

function ExerciseRender(props) {

    function handleClick() {
        props.onDelete(props.id)
    }

    return (
    
    <div className="card" style={{  
      backgroundImage: "url(" + props.style + ")"}}>
      <div className="paint_block">
      <div className="inner">
        <h2 className="title">{props.description} </h2>
        <br />
        <p>{props.duration}</p>
        <p>Date: {props.date}</p>
        Created by: {props.username}
        <br />
        <br />
        <br />
        <button type="button" className="btn btn-dark" onClick={handleClick}> Delete </button>
      </div>
        <br />
      </div>
       
                </div>
    )
}

export default ExerciseRender