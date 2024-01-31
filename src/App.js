import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import useLocalStorage from "./hooks/UseLocalStorage";
import Navigation from "./routes-nav/Navigation";
import Routers from "./routes-nav/Routes";
import LoadingSpinner from "./common/LoadingSpinner";
import JoblyApi from "./api/api";
import UserContext from "./auth/UserContext";
import jwt from "jsonwebtoken";

// Key name for storing token in localStorage for "remember me"
export const TOKEN_STORAGE_ID = "jobly-token"

// JOBLY APP

// infoLoaded ; has user data been taken from API

// currUser ; user obj from API way to tell if user is logged in; passed around via
// context throughout app

// token for logged users, this is their auth JWT
// required to be set for most API calls , this is initially read from localStorage
// synced to there via the useLocalStorage hook

// App => Routes

function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [applicationIds, setApplicationIds] = useState(new Set([]));
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  console.debug(
    "App",
    "infoLoaded", infoLoaded,
    "currentUser", currentUser,
    "token=", token
  );


  // Load user info from API. Until a user is logged in and they have a token,
  // this should not run. It only needs to re-run when a user logs out, so
  // the value of the token is a dependency for this effect.


useEffect(function loadUserInfo() {
async function getCurrentUser(){
  if(token){
    try{
      let {username} = jwt.decode(token);
      console.log("Token from localStorage:", token); // Debugging line
      //token on API class so it can be called 
      let currentUser = await JoblyApi.getCurrentUser(username);
      setCurrentUser(currentUser);
      setApplicationIds(new Set(currentUser.applications));
    } catch(e){
      console.error("App loadUserInfo problem loading", e);
      setCurrentUser(null);
    }
  }
  setInfoLoaded(true);
}

    // set infoLoaded to false while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to false to control the spinner.
setInfoLoaded(false);
getCurrentUser();


}, [token]);
  
//Handles logout

function logout(){
  setCurrentUser(null);
  setToken(null);
}

// Handles site wide signup
// auto logs user in (set token) upon signup
async function signup(signupData) {
  try{
    let token = await JoblyApi.signup(signupData);
    setToken(token);
    return { success: true };
  }catch(e){
    console.errors("signup fail", e);
    return { success: false, e};
  }
}

// Handles site wide login
// await function and check return value

async function login(loginData){
  try{
    let token = await JoblyApi.login(loginData);
    console.log("Received token:", token); // Debugging line
    setToken(token);
    JoblyApi.token = token;
    return { success: true };
  }catch(e){
    console.error("login fail", e);
    return { success: false, e};
  }
}

// Check if Job has been applied for

function hasAppliedToJob(id){
  return applicationIds.has(id);
}

// Apply to Job , make call to Api to update set of application IDs
function applyToJob(id){
  if (hasAppliedToJob(id)) return;
  JoblyApi.applyToJob(currentUser.username, id);
  setApplicationIds(new Set([...applicationIds,id]));
}

if (!infoLoaded) return <LoadingSpinner />;

return (
    <BrowserRouter>
    <UserContext.Provider
    value={{ currentUser, setCurrentUser, hasAppliedToJob, applyToJob}}>
      <div className="App">
        <Navigation logout={logout} />
        <Routers login={login} signup={signup} />
      </div>
    </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
