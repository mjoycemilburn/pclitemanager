import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { TESTING, RESTOREREQUIRED } from '../App';
import { auth } from '../lib/firebase_config';
import { login } from '../lib/login';

import { SetLocalCollectionCopies, ResetFirestoreCollectionsFromTestData } from '../services/working_data_setup'
import { Launchpad } from './Launchpad'

function LoginButton() {

    const [stateObject, updateStateObject] = useState(
        {
            email: "",
            password: "",
            userLoggedIn: false,
        });

    function handleChange({ target }) {
        // We need to keep state in line with the DOM at all time, so setState when anything changes. Set input field
        // styles to black so that an error input will change its style back to black as soon as you start typing

        updateStateObject({ ...stateObject, [target.name]: target.value });
    };

    if (!stateObject.userLoggedIn) {

        if (TESTING) {
            return (
                <p style={{ marginTop: "1.5rem" }}>
                    <button type='button'
                        style={{ fontSize: '1.1rem', border: "1px solid black", borderRadius: "5px", background: "aquamarine" }}
                        title='Login to the PCLiteManager webapp'
                        onClick={async (event) => {
                            event.stopPropagation(); // stops other buttons firing inadvertently

                            // await ResetFirestoreCollectionsFromTestData(); // remove the comment to restore a standard Firestore collection

                            await SetLocalCollectionCopies();
                            updateStateObject({ ...stateObject, userLoggedIn: true })
                            return;

                        }
                        }>Test Login</button>
                </p >
            );

        } else {

            return (
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <img alt = 'Website logo' style={{ maxWidth: '100%', marginTop: '3rem', border: '1px solid black', padding: '2rem', background: 'aquamarine' }} src='./assets/images/favicon.png' />
                    <p style={{ fontSize: '2rem', marginTop: '2rem' }}>
                        Milburn Parish Council Website
                    </p>
                    <form
                        autoComplete="on"
                        style={{ fontSize: "1.1rem", border: '1px solid black', padding: '2rem', width: '25%', margin: '2rem auto 0 auto' }}>

                        <div>
                            <label>Email:&nbsp;&nbsp;</label>

                            {/*see https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion#the_autocomplete_attribute_and_login_fields 
                            for info on the auto-completion of email and password fields - look for the section headed 'the autocompete attribute and login fields' 
                            
                            The curious reduction of dont-size seems to be a design feature of autofill - see stackoverflow at
                            https://stackoverflow.com/questions/56026043/how-to-prevent-chrome-from-changing-font-when-autofilling-username-password
                            This seems to extend to the "Login" content of the login <button element - bizarre! */}

                            <input
                                style={{ marginTop: "1rem" }}
                                type="email"
                                name="email"
                                size="20"
                                title="Enter your email Address"
                                onChange={handleChange} />
                        </div>

                        <div>
                            <label>Password:&nbsp;&nbsp;</label>
                            <input
                                style={{ marginTop: "1rem" }}
                                type="password"
                                name="password"
                                size="15"
                                title="Enter your Password for this system"
                                onChange={handleChange}
                                tabIndex="-1" />
                        </div>

                        <p style={{ marginTop: "1.5rem" }}>
                            <button type='button'
                                style={{ fontSize: '1.1rem', border: "1px solid black", borderRadius: "5px", background: "aquamarine" }}
                                title='Login to the PCLiteManager webapp'
                                onClick={async (event) => {
                                    let email = stateObject.email;
                                    let password = stateObject.password;
                                    event.stopPropagation(); // stops other buttons firing inadvertently

                                    // had to return a promise from the login function in order to get the
                                    // return values
                                    const returnedPromise = login(auth, email, password)
                                        .then(async returnValue => {
                                            if (returnValue === 1) {

                                                if (RESTOREREQUIRED) await ResetFirestoreCollectionsFromTestData(); // remove the comment to restore a standard Firestore collection

                                                await SetLocalCollectionCopies();
                                                updateStateObject({ ...stateObject, userLoggedIn: true })
                                                return;
                                            }
                                            alert("Blank User Credentials: " + returnValue.code + " " + returnValue.message);
                                            updateStateObject({ ...stateObject, userLoggedIn: false })
                                        })
                                        .catch(error => {
                                            if (error === 3) {
                                                toast.error("Oops - invalid email address");
                                                updateStateObject({ ...stateObject, userLoggedIn: false })
                                                return;
                                            }
                                            if (error === 4) {
                                                toast.error("Oops - invalid password");
                                                updateStateObject({ ...stateObject, userLoggedIn: false })
                                                return;
                                            }
                                            alert("Firebase error: " + error.code + " " + error.message);
                                            updateStateObject({ ...stateObject, userLoggedIn: false })
                                        });
                                }}

                            >Login</button>

                        </p>
                    </form>
                </div>
            );
        }
    } else {

        return (
            <div>
                <Launchpad currentSectionId={stateObject.currentSectionId} />
            </div>

        );
    }

}

export { LoginButton };