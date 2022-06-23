import React from 'react';
import { RefreshDisplayContext } from './Launchpad';
import { SectionSelectTableItem } from './SectionSelectTableItem';
import { SECTIONS } from '../services/working_data_setup';

function SectionSelectTable(props) {

    const refreshDisplay = React.useContext(RefreshDisplayContext)

    let sectionSelectTableStyle = {
        position: "absolute",
        zIndex: "1",
        background: "white",
        top: (props.displayState.sectionSelectButtonClickY - 15).toString() + "px",
        left: (props.displayState.sectionSelectButtonClickX + 20).toString() + "px",
        border: "1px solid black",
        padding: "0 .25rem 0 .25rem"
    };

    const sectionSelectTableItems = [];

    // maintain the sequenced order of the sections table
    let sortedSections = [...SECTIONS];
    sortedSections.sort((a, b) => (a.dataObject.entryTitle > b.dataObject.entryTitle) ? 1 : ((b.dataObject.entryTitle > a.dataObject.entryTitle) ? -1 : 0));

    sortedSections.forEach((section) => {
        if (section.dataObject.sectionId !== props.displayState.currentSectionId) {
            sectionSelectTableItems.push(
                <SectionSelectTableItem

                    key={section.dataObject.sectionId}
                    sectionId={section.dataObject.sectionId}
                    onClick={(event) => {
                        event.stopPropagation();
                        refreshDisplay(event, {
                            ...props.displayState,
                            sectionsVisible: false,
                            entriesVisible: true,
                            sectionSelectTableVisible: false,
                            currentSectionId: section.dataObject.sectionId
                        })
                    }}
                >
                </SectionSelectTableItem>
            )
        }
    });

    // add a "cancel" line

    sectionSelectTableItems.push(
        <SectionSelectTableItem

            key={"cancel"}
            sectionId={"cancel"}
            onClick={(event) => {
                event.stopPropagation();
                refreshDisplay(event, {
                    ...props.displayState,
                    sectionsVisible: false,
                    entriesVisible: true,
                    sectionSelectTableVisible: false,
                    currentSectionId: props.displayState.currentSectionId
                })
            }}
        >
        </SectionSelectTableItem>
    )

    if (props.displayState.sectionSelectTableVisible) {
        sectionSelectTableStyle.display = "block";
    } else {
        sectionSelectTableStyle.display = "none";
    }

    return (
        <span key={new Date().getTime()} style={sectionSelectTableStyle}>
            {sectionSelectTableItems}
        </span>
    )

}

export { SectionSelectTable }