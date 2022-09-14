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
                <div className="form-group">
                    <label>Username: </label>
                    <br />
                    <input ref={userRef} type="text" className="form-control w-25" maxlength="18"></input>
                    </div>
                    <br />
                    <div className="form-group">
                    <input type="submit" value="Submit" className="btn btn-dark"></input>
                </div>
            </form>
        </div>
    )
}


export default CreateUser