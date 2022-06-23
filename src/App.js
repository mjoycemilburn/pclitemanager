import React from 'react';
import './App.css';
import { LoginButton } from './components/LoginButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Using Toastify for user messages - see https://medium.com/swlh/making-your-reactjs-user-friendly-with-toastify-6cc553f2b08b
// and https://fkhadra.github.io/react-toastify/introduction/

var TESTING = false; // runs locally - no login and no file manipulation
var RESTOREREQUIRED = false; // refreshes the firestore database from the test data set

function App() {

    return (
      <div>
        <LoginButton />
        <ToastContainer position="top-center" theme="colored" autoClose={1000} />
      </div>
    );

}

export { App, TESTING, RESTOREREQUIRED };


