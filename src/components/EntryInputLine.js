import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { validateEntry, performDataCUD } from '../services/business_logic';
import { EntryEditLinesTable } from './EntryEditLinesTable';
import { EntryElement } from './EntryElement';

function EntryInputLine(props) {

    const initialStateObject =
    {
        dataObject: {
            sectionId: "",
            entryDate: "",
            entrySuffix: "",
            entryTitle: "",
            associatedFilename: ""
        },
        dataObjectId: '',
        errorObject: {
            entryTitleStyle: { color: 'black' },
            entryDateStyle: { color: 'black' },
            entrySuffixStyle: { color: 'black' },
            entryFilenameStyle: { color: 'black' },
        }
    };

    const [stateObject, updateStateObject] = useState(initialStateObject);

    let fileInput = React.createRef();

    function handleChange({ target }) {
        // We need to keep state in line with the DOM at all time, so setState when anything changes. Set input field
        // styles to black so that an error input will change its style back to black as soon as you start typing

        updateStateObject({
            dataObject: { ...stateObject.dataObject, [target.name]: target.value },
            dataObjectId: stateObject.dataObjectId,
            errorObject: initialStateObject.errorObject
        });
    };

    async function handleInsert(event) {
        event.preventDefault();

        let entryFilename = "";
        let entryFileObject = {};
        try {
            entryFileObject = fileInput.current.files[0];
            entryFilename = fileInput.current.files[0].name; 
        } catch {
        }

        //entryFilename = "dummy"; // remove the comments to bypass the requirement to enter a filename on an insert

        // Need to build a full state object for validation and CUD but can't do this through setState because this
        // would trigger a refresh of the entries lines and we don't want to do this until we've been through validation
        // and performCUD, so build the object in a"localStateObject" and submit this to setState once we're sure all is OK

        let localStateObject = {...stateObject}; 
        // 'Spread' syntax is used above to make localStateObject independent of stateObject. Making
        // localStateObject = stateObject; would mean that when we changed localState Object properties,
        // we would be changing these in statObject too - not what we want at all! For details see
        // https://www.sitepoint.com/variable-assignment-mutation-javascript/#:~:text=consistent%20and%20predictable.-,Mutations,the%20properties%20of%20a%20value.&text=Note%20that%20this%20has%20nothing,using%20const%20instead%20of%20let%20.
   
        if (props.section.dataObject.sectionType === "standard_title")
            localStateObject = { dataObject: { ...localStateObject.dataObject, sectionId: props.section.dataObject.sectionId, entryDate: "" } };
        if (props.section.dataObject.sectionType === "date_title")
            localStateObject = { dataObject: { ...localStateObject.dataObject, sectionId: props.section.dataObject.sectionId, entryTitle: "" } };

        localStateObject = { dataObject: { ...localStateObject.dataObject, associatedFilename: entryFilename } };    

        let validationResult = validateEntry("insert", props.section, localStateObject, entryFilename);
        if (validationResult.inputOK) {
            localStateObject.dataObjectId = await performDataCUD("entry", "C", localStateObject.dataObject, "", entryFileObject);

            // setting state now should trickle the consequences of the insert down into the entryLines table 
            updateStateObject(localStateObject);

            // clearing the state and calling setState again should now clear the form
            updateStateObject(initialStateObject);

            //clear the currently-selected filename
            fileInput.current.value = '';

            // toast the success
            toast.success("Yay - a new Entry!");

        } else {

            //re-render the input line with error indicators
            localStateObject.errorObject = validationResult.errorObject;
            updateStateObject(localStateObject);
            // display toast
            toast.error(validationResult.errorDetail);
        }
    };


    // Note that EntryEditLinesTable contains children with initial values and React won't re-render these
    // unless you give their parent a unique key. Note that you only seem to need to do this at the highest level

    return (

        <div>
            <form style={{ display: "flex", justifyContent: "center", padding: "1rem 0 1rem 0" }}>

                <EntryElement
                    section={props.section}
                    stateObject={stateObject}
                    handleChange={handleChange} />

                <label>&nbsp;&nbsp;Filename :&nbsp;</label>
                <input type='file' ref={fileInput}
                    style={stateObject.errorObject.entryFilenameStyle}
                    accept='application/pdf'
                    title='Select a pdf file for this entry'
                />&nbsp;&nbsp;&nbsp;

                <button type='button'
                    title='Insert this entry'
                    onClick={handleInsert}
                >Insert</button>
            </form>
            <EntryEditLinesTable section={props.section} />
        </div>
    )
}

export { EntryInputLine };