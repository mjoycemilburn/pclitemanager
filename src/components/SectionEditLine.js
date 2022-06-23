import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateSection, performDataCUD } from '../services/business_logic';
import { SectionElement } from './SectionElement';
import { ENTRIES, SECTIONS } from '../services/working_data_setup';
import { RefreshDisplayContext } from './Launchpad';

function SectionEditLine(props) {

    const refreshDisplay = React.useContext(RefreshDisplayContext)

    const initialErrorObject = {
        sectionIdStyle: { color: 'black' },
        sectionHeaderStyle: { color: 'black' },
        sectionTypeStyle: { color: 'black' },
        sectionPrefixStyle: { color: 'black' },
    }

    const [stateObject, updateStateObject] = useState(
        {
            dataObject: props.section.dataObject,
            dataObjectId: props.section.dataObjectId,
            errorObject: initialErrorObject
        }
    );

    function handleChange({ target }) {

        updateStateObject({
            dataObject: { ...stateObject.dataObject, [target.name]: target.value },
            dataObjectId: stateObject.dataObjectId,
            errorObject: initialErrorObject
        });
    };

    async function handleUpdate(event) {
        event.preventDefault();

        // if sectionId etc are changing, we'll need their initial values later. But while this is currently
        // available from props.section.dataObject, it seems that this is bound to SECTIONS
        // because when this is changed by performDataCUD, the props properties for the section etc change
        // as well. So create a local variable so we can hang on to them

        let originalSectionObject = {dataObject: {...props.section.dataObject}}; 

        // clear out any error states carried forward from a previous failed validation

        let localStateObject = {
            dataObject: stateObject.dataObject,
            dataObjectId: stateObject.dataObjectId,
            errorObject: initialErrorObject
        }

        let validationResult = validateSection("update", localStateObject, originalSectionObject);

        if (validationResult.inputOK) {

            // synchronise the database/local arrays with the DOM and stateObject
            await performDataCUD("section", "U", localStateObject.dataObject, localStateObject.dataObjectId);

            // if the sectionId has just changed, change the sectionId for any associated entry records

            if (localStateObject.dataObject.sectionId !== originalSectionObject.sectionId) {
                ENTRIES.forEach(async (entry) => {
                    if (entry.dataObject.sectionId === originalSectionObject.sectionId) { 
                        entry.dataObject.sectionId = localStateObject.dataObject.sectionId;
                        await performDataCUD("entry", "U", entry.dataObject, localStateObject.dataObjectId);
                    }
                });

                // refresh the whole display so we reset the currently-selected section in the Launchpad as
                // well as dealing with the deletion of a section

                refreshDisplay(event, {
                    ...props.displayState,
                    sectionsVisible: true,
                    entriesVisible: false,
                    sectionSelectTableVisible: false,
                    currentSectionId: localStateObject.dataObject.sectionId
                })
            }

            // setting state now should trickle the consequences of the insert down into the sectionLines table 
            updateStateObject(localStateObject);

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
        event.preventDefault();

        // clear out any error states carried forward from a previous failed validation

        let localStateObject = {
            dataObject: stateObject.dataObject,
            dataObjectId: stateObject.dataObjectId,
            errorObject: initialErrorObject
        }

        let validationResult = validateSection("delete", localStateObject, {});
        if (validationResult.inputOK) {

            await performDataCUD("section", "D", props.section.dataObject, props.section.dataObjectId);

            // remove any "holes" in the section sequence numbers as otherwise we'll
            // get a duplicate  next time we insert an item at the end with a valuer
            // of SECTIONS.length

            let sortedSections = [...SECTIONS];
            sortedSections.sort((a, b) => (a.dataObject.sectionSequenceNumber > b.dataObject.sectionSequenceNumber) ? 1 : ((b.dataObject.sectionSequenceNumber > a.dataObject.sectionSequenceNumber) ? -1 : 0));
            sortedSections.forEach(async (section, index) => {
                if (section.dataObject.sectionSequenceNumber !== index) {
                    section.dataObject.sectionSequenceNumber = index;
                    await performDataCUD("section", "U", section.dataObject, section.dataObjectId);
                }
            })

            toast.success("Bye bye section!");

            // refresh the whole display so we reset the launchpad and its current section too in case we've
            // just deleted the currentSection

            refreshDisplay(event, {
                ...props.displayState,
                sectionsVisible: true,
                entriesVisible: false,
                sectionSelectTableVisible: false,
                currentSectionId: SECTIONS[0].dataObject.sectionId
            })

        } else {

            //re-render the input line with error indicators
            localStateObject.errorObject = validationResult.errorObject;
            updateStateObject(localStateObject);
            // display toast
            toast.error(validationResult.errorDetail);  
        }
    }

    return (
        <form style={{ display: "flex", justifyContent: "center", padding: "1rem 0 0 0" }}>

            <SectionElement
                section={props.section}
                stateObject={stateObject}
                handleChange={handleChange}
            />

            <span>
                <button type='button'
                    title='Update this section'
                    onClick={handleUpdate}>Update
                </button>&nbsp;&nbsp;

                <button type='button'
                    title='Delete this section'
                    onClick={handleDelete}>Delete
                </button>
            </span>
        </form>
    )
}

export { SectionEditLine };
