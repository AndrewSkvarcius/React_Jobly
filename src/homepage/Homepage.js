import React, { useContext} from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";
import UserContext from "../auth/UserContext";


// Hompage Shows Welcome message or Login/register

//routed @ /

function Homepage(){
    const {currentUser} = useContext(UserContext);
    console.debug("Hompage", "currentUser=", currentUser)

    return (
        <div className="Homepage">
            <div className="container text-center">
                <h1 className="mb-4 font-weight-bold">Jobly</h1>
                <p className="lead">One Covenient Place, For All The Jobs</p>
                {currentUser
                ? <h2>
                    Welcome Back,{currentUser.firstName || currentUser.username}!
                </h2>
                : (
                    <p>
                        <Link className="btn btn-primary font-weight-bold mr-3"
                        to="/login">Login In</Link>
                        <Link className="btn btn-primary font-weight-bold"
                        to="/signup">
                            Sign Up
                        </Link>
                    </p>
                )}
            </div>

        </div>
    );
}

export default Homepage;