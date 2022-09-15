import React from "react";

function ExerciseRender(props) {
  function handleDelete() {
    props.onDelete(props.id);
  }

  function handleEdit() {
    props.onEdit(props.id);
  }

  return (
    <div
      className="card"
      style={{
        backgroundImage: "url(" + props.style + ")",
      }}
    >
      <div className="paint_block">
        <div className="inner">
          <h2 className="title">{props.description} </h2>
          <p>{props.duration}</p>
          <p>Date: {props.date}</p>
          <p>Created by: {props.username}</p>
          <p>Description: {props.text}</p>
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={handleEdit}
          >
            Edit
          </button>
          <br />
          <button type="button" className="btn btn-dark" onClick={handleDelete}>
            Delete
          </button>
        </div>
        <br />
      </div>
    </div>
  );
}

export default ExerciseRender;
