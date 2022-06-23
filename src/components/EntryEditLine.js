import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateEntry, performDataCUD } from '../services/business_logic';
import { EntryElement } from './EntryElement';

function EntryEditLine(props) {

    const initialErrorObject = {
        entryTitleStyle: { color: 'black' },
        entryDateStyle: { color: 'black' },
        entrySuffixStyle: { color: 'black' },
        entryFilenameStyle: { color: 'black' },
    }

    const [stateObject, updateStateObject] = useState(
        {
            dataObject: props.entry.dataObject,
            dataObjectId: props.entry.dataObjectId,
            errorObject: initialErrorObject
        }
    );

    let fileInput = React.createRef();

    function handleChange({ target }) {

        updateStateObject({
            dataObject: { ...stateObject.dataObject, [target.name]: target.value },
            dataObjectId: stateObject.dataObjectId,
            errorObject: initialErrorObject
        });
    };

    async function handleUpdate(event) {
        event.preventDefault();

        let entryFilename = "";
        let entryFileObject = {};
        try {
            entryFileObject = fileInput.current.files[0];
            entryFilename = fileInput.current.files[0].name; // don't put this in state because it doesn't affect the rendered display
        } catch {
        }

        //entryFilename = "dummy";

        // clear out any error states carried forward from a previous failed validation

        let localStateObject = {
            dataObject: stateObject.dataObject,
            dataObjectId: stateObject.dataObjectId,
            errorObject: initialErrorObject
        }

        let validationResult = validateEntry("update", props.section, localStateObject, entryFilename);
        if (validationResult.inputOK) {

            // synchronise the database with the DOM and stateObject
            await performDataCUD("entry", "U", localStateObject.dataObject, localStateObject.dataObjectId, entryFileObject);

            // setting state now should trickle the consequences of the insert down into the entryLines table 
            updateStateObject(localStateObject);

            // re-render the entries table to deal with any reordering requirement
            props.refreshEntryEditLinesTable();

            //clear the error details line
            fileInput.current.value = '';

            // display toast
            toast.success("Yup - got that!");

        } else {

            //re-render the input line with error indicators
            localStateObject.errorObject = validationResult.errorObject;
            updateStateObject(localStateObject);
            // display toast
            toast.error(validationResult.errorDetail);

        }
    }

    async function handleDelete(event) {

        if (window.confirm("Did you really mean to delete this entry?")){
        event.preventDefault();
        await performDataCUD("entry", "D", props.entry.dataObject, props.entry.dataObjectId, '');

        props.refreshEntryEditLinesTable();
        toast.success("Bye bye entry!");
        }
    }

    return (
        <form style={{ display: "flex", justifyContent: "center", padding: "1rem 0 0 0" }}>
            <button type='button'
                title='Preview the file currently linked to this entry'
                onClick={(e) => {
                    window.open("https://storage.googleapis.com/entry-files-for-pclite-system/" + props.entry.dataObject.associatedFilename)
                }}>Preview</button>

            <EntryElement
                section={props.section}
                stateObject={stateObject}
                handleChange={handleChange}
            />

            <label>&nbsp;&nbsp;Filename :&nbsp;&nbsp;</label>
            <input type='file' ref={fileInput}
                style={stateObject.errorObject.entryFilenameStyle}
                accept='application/pdf'
                title='Select a pdf file for this entry' />&nbsp;&nbsp;&nbsp;

            <button type='button'
                title='Update this entry'
                onClick={handleUpdate}>Update
            </button>&nbsp;&nbsp;

            <button type='button'
                title='Delete this entry'
                onClick={handleDelete}>Delete
            </button>

        </form>
    )
}

export { EntryEditLine };
