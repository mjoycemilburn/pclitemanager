import React from 'react';
import { SectionInputLine } from './SectionInputLine';

function SectionsManagementTable(props) {

  let displayStyle = { display: 'none' };
  if (props.displayState.sectionsVisible) displayStyle = { display: 'block' };

  return (

    <div style={displayStyle}>
      <h2 style={{
        textAlign: "center",
        marginTop: "3vh"
      }}>Configure Sections</h2>
      <p style={{
        color: "red",
        padding: "0",
        fontWeight: "bold",
        textAlign: "center",
        margin: "0",
      }}><br />
      </p>
      <SectionInputLine />
    </div>
  )
}

export { SectionsManagementTable };