import React from 'react';
import { SECTIONS } from '../services/working_data_setup';
import { EntryInputLine } from './EntryInputLine';

function EntriesManagementTable(props) {

  let section = {};

  SECTIONS.forEach((candidateSection) => {
    if (candidateSection.dataObject.sectionId === props.displayState.currentSectionId) {
      section = candidateSection;
    }
  });

  let displayStyle = {display: 'none'};
  if (props.displayState.entriesVisible) displayStyle = { display: 'block' };

  return (
    <div style={displayStyle}>
      <h2 style={{
        textAlign: "center",
        marginTop: "3vh"
      }}>Manage Entries for the "{props.displayState.currentSectionId}" Section</h2>
      <p style={{
        color: "red",
        padding: "0",
        fontWeight: "bold",
        textAlign: "center",
        margin: "0",
      }}><br />
      </p>
      <EntryInputLine section={section} />
    </div>
  )
}

export { EntriesManagementTable };