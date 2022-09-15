import React, { useRef } from 'react';
import swal from 'sweetalert';
import * as Realm from 'realm-web'

function CreateUser() {

    const userRef = useRef()

    async function submitHandler(event) {
        event.preventDefault()

        const userCurrentValue = userRef.current.value
        const userObject = {username: userCurrentValue}


        const app = new Realm.App({ id: process.env.REACT_APP_MONGO_REALM_ID });
        const credentials = Realm.Credentials.anonymous();
        try 
        {
            const user = await app.logIn(credentials);
            user.functions.createUserHandler(userObject);
            swal(`User ${userObject.username} added!`);
            setTimeout(() => window.location = "/", 2500);
        } 
        catch(err) 
        {
            console.error("Failed to log in", err);}
        }
    


    return (
        <div className="container">
            <h3>Create New User</h3>
            <form onSubmit={submitHandler}>
<br />
                <div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="inputGroup-sizing-default">Username</span>
  </div>
  <input ref={userRef} type="text" class="form-control" aria-label="username"></input>&nbsp;&nbsp;&nbsp;
  <input type="submit" value="Submit" className="btn btn-dark"></input>
</div>
            </form>
        </div>
    )
}


export default CreateUser