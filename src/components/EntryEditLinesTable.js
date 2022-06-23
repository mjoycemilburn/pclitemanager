import React, { useState } from 'react';
import { ENTRIES } from '../services/working_data_setup';
import { EntryEditLine } from './EntryEditLine';

function EntryEditLinesTable(props) {

    // An editLine update may trigger a need to refresh the edit lines table by re-sorting it or
    // removing a deleted element so we need a state variable that we can use to trigger a re-render. 
    // We do this by adding/ a refreshCount variable that we can update via a callback   

    function refreshEntryEditLinesTable() {
        incrementRefreshCount(refreshCount + 1); // trigger a re-render
    }

    // so we need a state variable that we can use to trigger a re-render. We do this by adding
    // a refreshCount variable that we can update via the refreshEntryEditLinesTable callback

    const [refreshCount, incrementRefreshCount] = useState(0);
    let sectionEditLines = [];

    function buildSectionEditLines() {  // build the editLies display and return an updated refreshCount

        let sortedEntries = [...ENTRIES];
        if (props.section.dataObject.sectionType === "standard_title") {
            sortedEntries.sort((a, b) => (a.dataObject.entryTitle > b.dataObject.entryTitle) ? 1 : ((b.dataObject.entryTitle > a.dataObject.entryTitle) ? -1 : 0));
        }
        if (props.section.dataObject.sectionType === "date_title") {
            sortedEntries.sort((a, b) => (a.dataObject.entryDate < b.dataObject.entryDate) ? 1 : ((b.dataObject.entryDate < a.dataObject.entryDate) ? -1 : 0));
        }

        sortedEntries.forEach((entry) => {
            if (entry.dataObject.sectionId === props.section.dataObject.sectionId) {
                sectionEditLines.push(
                    <div key={entry.dataObjectId}>

                        <EntryEditLine
                            section={props.section}
                            entry={entry}
                            key={entry.dataObjectId}
                            refreshEntryEditLinesTable={refreshEntryEditLinesTable}
                        />

                    </div>
                )
            }
        });

        return refreshCount + 1; // 

    }

    buildSectionEditLines();

    return (
        <div key={new Date().getTime()}>
            {sectionEditLines}
        </div>
    );

}

export { EntryEditLinesTable };