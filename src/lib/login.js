import { setPersistence, browserSessionPersistence, signInWithEmailAndPassword } from 'firebase/auth';

function login(auth, email, password) {

    // returns  1 if successful login
    //          2 if logged in but credentials blank (??)
    //          3 if incorrect email
    //          4 if incorrect password
    //          error object if firebase login fails

    return new Promise(function (succeed, fail) {

        setPersistence(auth, browserSessionPersistence)
            .then(() => {

                // Existing and future Auth states are now persisted in the current
                // session only. Closing the window would clear any existing state even
                // if a user forgets to sign out.
                // ...
                // New sign-in will be persisted with session persistence.

                signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {


                        // Signed in
                        let user = userCredential.user;
                        if (user !== null) {
                            succeed(1);
                        } else {
                            succeed(2);
                        }

                    })
                    .catch((error) => {
                        if (error.message.indexOf("user-not-found") !== -1) {
                            fail(3);
                        } else {
                            if (error.message.indexOf("wrong-password") !== -1) {
                                fail(4);
                            } else {
                                fail(error);
                            }
                        }
                    });
            });
    });
}

export {login }