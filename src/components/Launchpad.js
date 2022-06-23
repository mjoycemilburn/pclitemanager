import React, { useState } from 'react';
import { SectionSelectButton } from './SectionSelectButton';
import { SectionsManagementTable } from './SectionsManagementTable';
import { EntriesManagementTable } from './EntriesManagementTable';

const RefreshDisplayContext = React.createContext();

// Basically, the entire display is specified by the State of the Launchpad.
// This tells you whether "sections" or "entries" are to be on view but also
// handles the visibility of the "section selection" table pulled up by the
// "caret" icon in the launchpad's entries button. Where actions lower down
// in the hierarchy need to communicate a change back to Launchpad they do
// this via the Launchpad's "refreshDisplay" function which is passed through
// to them via the RefreshDisplayContext variable. When the state change is
// received by the Launchpad, it refreshes and feeds the consequences down
// to all the subordinates

function Launchpad(props) {

    const launchPadLinkStyle = {
        padding: "1vh",
        background: "aquamarine",
        border: "1px solid black",
        borderRadius: ".5em",
        textDecoration: "none!important",
        margin: "1vh auto 1vh auto",
        cursor: "pointer"
    };

    const [stateObject, updateStateObject] = useState({
        sectionsVisible: false,
        entriesVisible: true,
        sectionSelectTableVisible: false,
        sectionSelectButtonClickX: 0,
        sectionSelectButtonClickY: 0,
        currentSectionId: "about",
    });

    function refreshDisplay(event, newDisplayState) {
        updateStateObject({
            sectionsVisible: newDisplayState.sectionsVisible,
            entriesVisible: newDisplayState.entriesVisible,
            sectionSelectTableVisible: newDisplayState.sectionSelectTableVisible,
            sectionSelectButtonClickX: newDisplayState.sectionSelectButtonClickX,
            sectionSelectButtonClickY: newDisplayState.sectionSelectButtonClickY,
            currentSectionId: newDisplayState.currentSectionId,
        })
    }

    return (
        <RefreshDisplayContext.Provider value={refreshDisplay}>

            <h2 style={{ width: "80%", margin: "3vh auto 0 auto", textAlign: "center", padding: "1vh 0 1vh 0", background: "Aquamarine" }}>
                Management Screen for Milburn Parish Council Website
            </h2>

            <div style={{ display: "flex", width: "50%", justifyContent: "space-around", border: "1px solid black", margin: "3vh auto 0 auto" }}>
                <p style={launchPadLinkStyle}
                    title="Add/remove/reorder/edit Sections"
                    onClick={(event) => {
                        refreshDisplay(event, {
                            ...stateObject,
                            sectionsVisible: true,
                            entriesVisible: false,
                            sectionSelectTableVisible: false,
                        })
                    }}>Configure Sections
                </p>
                <p style={launchPadLinkStyle}
                    title="Add/remove/edit Entries for the selected section"
                    onClick={(event) => {
                        refreshDisplay(event, {
                            ...stateObject,
                            sectionsVisible: false,
                            entriesVisible: true,
                        })
                    }}>Manage Entries for the&nbsp;
                    <SectionSelectButton displayState={stateObject} />
                    <span> Section</span>
                </p>
            </div >

            <EntriesManagementTable displayState={stateObject} />
            <SectionsManagementTable displayState={stateObject} />

        </RefreshDisplayContext.Provider>
    );
}

export { Launchpad, RefreshDisplayContext };
