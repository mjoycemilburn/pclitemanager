import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { SECTIONS } from '../services/working_data_setup';
import { validateSection, performDataCUD } from '../services/business_logic';
import { SectionEditLinesTable } from './SectionEditLinesTable';
import { SectionElement } from './SectionElement';
import { RefreshDisplayContext } from './Launchpad';

function SectionInputLine(props) {

    const refreshDisplay = React.useContext(RefreshDisplayContext)

    // initialise the stateObject with the default properties of a new Section

    const initialStateObject =
    {
        dataObject: {
            sectionId: "",
            sectionHeader: "",
            sectionType: "standard_title",
            sectionPrefix: "",
            sectionSequenceNumber: SECTIONS.length,
        },
        dataObjectId: '',
        errorObject: {
            sectionIdStyle: { color: 'black' },
            sectionHeaderStyle: { color: 'black' },
            sectionTypeStyle: { color: 'black' },
            sectionPrefixStyle: { color: 'black' },
        },
    };

    const [stateObject, updateStateObject] = useState(initialStateObject);

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

        let validationResult = validateSection("insert", stateObject, {});
        if (validationResult.inputOK) {
            await performDataCUD("section", "C", stateObject.dataObject, "");

            // clearing the state and calling setState again should now clear the form and displayS the new
            // line in the SectionEditLinesTable because CUD has updated the source data
            updateStateObject(initialStateObject);

            // refresh the whole display so we reset the currently-selected section in the Launchpad

            refreshDisplay(event, {
                ...props.displayState,
                sectionsVisible: true,
                entriesVisible: false,
                sectionSelectTableVisible: false,
                currentSectionId: stateObject.dataObject.sectionId
            })

            toast.success("Yay - a new Section!");

        } else {
            
            updateStateObject({...stateObject, errorObject: validationResult.errorObject});
            // display toast
            toast.error(validationResult.errorDetail);
        }
    };

    return (
        <div>
            <form style={{ display: "flex", justifyContent: "center", padding: "1rem 0 1rem 0" }}>

                <SectionElement
                    stateObject={stateObject}
                    handleChange={handleChange} />

                <button type='button'
                    title='Insert this section'
                    onClick={handleInsert}
                >Insert</button>
            </form>
            <SectionEditLinesTable/>
        </div>
    )
}

export { SectionInputLine };