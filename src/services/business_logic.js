import { db, storage } from '../lib/firebase_config.js';
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, deleteObject } from "firebase/storage";
import { SECTIONS, ENTRIES } from './working_data_setup';
import { TESTING } from '../App';

function validateEntry(action, section, candidateEntry, candidateEntryFilename) {

    // action = "insert", "update"
    //
    // section is the SECTION object for the candidateEntry ENTRY object's sectionId

    let errorObject = {
        entryTitleStyle: { color: 'black' },
        entryDateStyle: { color: 'black' },
        entrySuffixStyle: { color: 'black' },
        entryFilenameStyle: { color: 'black' },
    }

    if (section.dataObject.sectionType === "standard_title") {
        if (candidateEntry.dataObject.entryTitle === '') {
            errorObject.entryTitleStyle = { color: 'red' };
            return { inputOK: false, errorObject, errorDetail: "Oops - you need to specify an entry title" };
        }

        // see if there's a match for the candidate fields in other entries (and obviously exclude the
        // candidate entry row itself)
        let matched = false;
        for (let i = 0; i < ENTRIES.length; i++) {
            if (ENTRIES[i].dataObjectId !== candidateEntry.dataObjectId) {
                if (ENTRIES[i].dataObject.sectionId === section.dataObject.sectionId) {
                    if (ENTRIES[i].dataObject.entryTitle === candidateEntry.dataObject.entryTitle) {
                        i = ENTRIES.length;
                        matched = true;
                    }
                }
            }
        };
        if (matched) {
            errorObject.entryTitleStyle = { color: 'red' };
            return { inputOK: false, errorObject, errorDetail: "Oops - title needs to be unique within this section" };
        }
    }

    if (section.dataObject.sectionType === "date_title") {
        if (candidateEntry.dataObject.entryDate === '') {
            errorObject.entryDateStyle = { color: 'red' };
            return { inputOK: false, errorObject, errorDetail: "Oops - you need to specify an entry date" };
        }

        // see if there's a match for the candidate fields in other entries (and obviously exclude the
        // candidate entry row itself)
        let matched = false;
        for (let i = 0; i < ENTRIES.length; i++) {
            if (ENTRIES[i].dataObjectId !== candidateEntry.dataObjectId) {
                if (ENTRIES[i].dataObject.sectionId === section.dataObject.sectionId) {
                    if (ENTRIES[i].dataObject.entryDate === candidateEntry.dataObject.entryDate && ENTRIES[i].dataObject.entrySuffix === candidateEntry.dataObject.entrySuffix) {
                        i = ENTRIES.length;
                        matched = true;
                    }
                }
            }
        };
        if (matched) {
            errorObject.entryDateStyle = { color: 'red' };
            errorObject.entrySuffixStyle = { color: 'red' };
            return { inputOK: false, errorObject, errorDetail: "Oops - the combination of date and suffix needs to be unique within this section" };
        }
    }

    if (action === "insert" && candidateEntryFilename === '') {
        errorObject.entryFilenameStyle = { color: 'red' };
        return { inputOK: false, errorObject, errorDetail: "Oops - you need to specify a filename" };
    }

    return { inputOK: true, errorObject, errorDetail: "" };
}

function validateSection(action, candidateSection, originalSection) {

    // action = "insert", "update", "delete"

    let errorObject = {
        entryTitleStyle: { color: 'black' },
        entryDateStyle: { color: 'black' },
        entrySuffixStyle: { color: 'black' },
        entryFilenameStyle: { color: 'black' },
    }

    let matched = '';

    if (action === "insert" || action === "update") {

        if (candidateSection.dataObject.sectionId === '') {
            errorObject.entrySectionIdStyle = { color: 'red' };
            return { inputOK: false, errorObject, errorDetail: "Oops - you need to supply a Section id tag for the section" };
        }

        if (candidateSection.dataObject.sectionHeader === '') {
            errorObject.entrySectionHeaderStyle = { color: 'red' };
            return { inputOK: false, errorObject, errorDetail: "Oops - you need to supply a header for the section" };
        }
    }

    // see if there's already a sectionId for candidateSection.sectionId
    // candidate entry row itself)

    matched = false;
    for (let i = 0; i < SECTIONS.length; i++) {
        if (SECTIONS[i].dataObject.sectionId === candidateSection.dataObject.sectionId) {
            i = SECTIONS.length;
            matched = true;
        }
    };

    if (action === "insert" ||
        (action === "update" && candidateSection.dataObject.sectionId !== originalSection.dataObject.sectionId)) {
        if (matched) {
            errorObject.sectionIdStyle = { color: 'red' };
            return { inputOK: false, errorObject, errorDetail: "Oops - there's already a section with this sectionId" };
        }
    }

    if (action === "update") {
        // see if the original section already has entries - in which case we need to prevent sectionType changes

        matched = false;
        for (let i = 0; i < ENTRIES.length; i++) {
            if (ENTRIES[i].dataObject.sectionId === originalSection.dataObject.sectionId) {
                i = ENTRIES.length;
                matched = true;
            }
        };

        if (candidateSection.dataObject.sectionType !== originalSection.dataObject.sectionType && matched) {
            errorObject.sectionTypeStyle = { color: 'red' };
            return { inputOK: false, errorObject, errorDetail: "Oops - this section contains entries - delete these first" };
        }
    }

    // No need to check if a section whose sectionId is changing has entries because the associated
    // filenames are now independent of sectionId ( see associatedFilename property). 

    // But it seems like a good idea to prevent users from deleting sections with associated entries

    if (action === "delete") {

        for (let i = 0; i < ENTRIES.length; i++) {
            if (ENTRIES[i].dataObject.sectionId === candidateSection.dataObject.sectionId) {
                i = ENTRIES.length;
                errorObject.sectionIdStyle = { color: 'red' };
                return { inputOK: false, errorObject, errorDetail: "Oops - this section contains entries - delete these first" };
            }
        };

    }

    return { inputOK: true, errorObject, errorDetail: "" };
}

//  SECTIONS = [ {dataObject: {sectionId: "about", sectionHeader: "About", sectionType: "standard_title", sectionPrefix: "", sectionSequenceNumber: "0" }, dataObjectId: YPQ123jk..L},]
//  ENTRIES = [ {dataObject:   { sectionId: "agendas", entryDate: "2017-05-02", entrySuffix: "AGM and Parish Mtg", entryTitle: "(AGM & Parish Mtg)", associatedFilename }, dataObjectId: ZY$hj123jk..P},]

async function performDataCUD(dataObjectType, transactionType, dataObject, dataObjectId, entryFileObject) {

    // dataObjectType - "section" or "entry"
    // transactionType - "C", "U" or "D"
    // dataObject, dataObjectId - the data and database key for the section or entry
    // entryFileObject - an object representing any associated user file

    let myCollection = "";
    let myArray = [];
    let index = "";

    if (dataObjectType === "section") {
        myCollection = "sections";
        myArray = SECTIONS; // see https://stackoverflow.com/questions/17382427/are-there-pointers-in-javascript
    }
    if (dataObjectType === "entry") {
        myCollection = "entries";
        myArray = ENTRIES;
    }

    let myCollRef = {};
    let myDocRef = {};

    switch (transactionType) {
        case "C":

            if (TESTING) {
                myArray.push({ dataObject: dataObject, dataObjectId: Math.random() });
            } else {
                myCollRef = collection(db, myCollection);
                myDocRef = doc(myCollRef);
                await setDoc(myDocRef, dataObject);
                myArray.push({ dataObject: dataObject, dataObjectId: myDocRef.id })
            }

            // Upload the associated pdf file using the same name as the supplied local
            // file - a different approach to the generated names used in the original 
            // arrangement (based on sectionId etc) but essential as there's no way of 
            // renaming files in the GCP using plain Javascript. However this does make
            // life a lot easier when sectionId etc change and you have to work through
            // the consequences for uploaded files

            if (dataObjectType === "entry") {

                if (!TESTING) {
                    uploadFile(entryFileObject.name, entryFileObject);
                }
            }

            break;

        case "U":
            if (TESTING) {
                //do nothing - the data will be added to the local arrays by the common code below
            } else {
                myDocRef = doc(db, myCollection, dataObjectId);
                await setDoc(myDocRef, dataObject, { merge: false })
            }

            // get the index of the array element containing dataObjectId and replace the dataObject property
            index = myArray.findIndex(object => {
                return object.dataObjectId === dataObjectId;
            });
            myArray[index].dataObject = dataObject;

            // upload any file that may have been provided

            if (dataObjectType === "entry" && entryFileObject.name !== "") {

                if (!TESTING) {
                    uploadFile(entryFileObject.name, entryFileObject);
                }
            }

            break;

        case "D":
            if (TESTING) {
                //do nothing - the data will be removed from the local arrays by the common code below
            } else {
                myDocRef = doc(db, myCollection, dataObjectId);
                await deleteDoc(myDocRef);
                // get the index of the array element containing myDocRef.id and remove it
            }
            index = myArray.findIndex(object => {
                return object.dataObjectId === dataObjectId;
            });
            myArray.splice(index, 1);

            //delete any associated file - note doesn't error if file doesn't exist
            if (dataObjectType === "entry") {
                if (!TESTING) {
                    deleteFile(dataObject.associatedFilename);
                }
            }

            break;

        default:
        // code block - nothing to do
    }
}

function uploadFile(googleFilename, entryFileObject) {

    //  the storage object has been set by firebase.js and is pointing at the default bucket

    const storageRef = ref(storage, googleFilename);

    uploadBytes(storageRef, entryFileObject).then(() => {
        // File uploaded successfully
    }).catch((error) => {
        window.alert("Oops - System error. Contact Martin and quote error code " + error);
    });
}

function deleteFile(googleFilename) {

    const storageRef = ref(storage, googleFilename);

    deleteObject(storageRef).then(() => {
        // File deleted successfully
    }).catch((error) => {
        window.alert("Oops - System error. Contact Martin and quote error code " + error);
    });
}

export { validateEntry, validateSection, performDataCUD, uploadFile, deleteFile };
