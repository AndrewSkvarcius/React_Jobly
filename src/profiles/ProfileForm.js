import React, { useState, useContext } from "react";
import Alert from "../common/Alert";
import JoblyApi from "../api/api";
import UserContext from "../auth/UserContext";

//import useTimedMessage from "../hooks/UseTimedMessage";

// PROFILE  EDITING FORM 
// Displays profilr form and handles changes tolocal state
// Submits form calls to Api to save and starts  user reloading thoughout site

// Routed as /profile
// Routes => ProfileForm => Alert

function ProfileForm(){
    const { currentUser, setcurrUser} = useContext(UserContext);
    const [formData, setFormData] = useState({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        username: currentUser.currUser,
        password: "",
    });
    const [formErrors, setFormErrors] = useState([]);

    // switch to use or limited time display message hook
    const [saveConfirmed, setSaveConfirmed] = useState(false);
    // const [saveConfirmed, setSaveConfirmed] = useTimedMessage()

    console.debug(
        "ProfileForm",
        "currentUser=", currentUser,
        "formData=", formData,
        "formErrors=", formErrors,
        "saveConfirmed=", saveConfirmed,
    );
    /**on form Submit:
    //* - attempt save to backend & report any errors
     * - if successful
     *   - clear previous error messages and password
     *   - show save-confirmed message
     *   - set current user info throughout the site
    */

    async function handleSubmit(e){
        e.preventDefault();

        let profileData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
        }

        let username = formData.username;
        let updatedUser;

        try{
            updatedUser = await JoblyApi.saveProfile(username, profileData);

        }catch(err){
            debugger;
            setFormErrors(err);
            return;
        }

        setFormData(form =>({...form, password:""}));
        setFormErrors([]);
        setSaveConfirmed(true);

        // starts reloading of user info throughout site
        setcurrUser(updatedUser);
    }
        // Handle form data changing 
        function handleChange(e) {
            const {name, value } = e.target;
            setFormData(form => ({
                ...form, [name]: value,
            }));
            setFormErrors([]);
        }
    return (
        <div clasName=" col-md-6 col-lg-4 offest-md-3 offset-lg-4">
            <h3>Profile</h3>
            <div clasName="card">
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <label>Username</label>
                            <p className="form-control-plaintext">{formData.username}</p>
                        </div>
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                            name="lastName"
                            className="form-control"
                            value={formData.lastName}
                            onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm password to make changes:</label>
                            <input
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            />
                        </div>

                        {formErrors.length
                        ? <Alert type="danger" messages={["Updated"]} />
                        :null}
                        <button className="btn btn-primary btn-block mt-4"
                        onClick={handleSubmit}
                        >Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );    
 
}
export default ProfileForm;