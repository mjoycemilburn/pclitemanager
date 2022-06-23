import React from 'react';
import { RefreshDisplayContext } from './Launchpad';
import { SectionSelectTable } from './SectionSelectTable';
import caret from './caret-bottom.svg'; // with import

// The src file reference in the img tag below is a challenge - see 
// https://stackoverflow.com/questions/39999367/how-do-i-reference-a-local-image-in-react
// for background. Additionally, it seems that the reference cannot be made to 
// locations outside the src folder itself 

function SectionSelectButton(props) {

    const refreshDisplay = React.useContext(RefreshDisplayContext)

    return (
        <span style={{ backgroundColor: "wheat", paddingLeft: "0.5em", border: "2px solid black" }}>
            {props.displayState.currentSectionId}
            < img style={{ padding: "0 0.25rem 0 0.25rem", verticalAlign: "middle" }}
                src={caret}
                alt='caret-bottom symbol'
                title='Click here to select a different section for entries display'
                onClick={(event) => {
                    event.stopPropagation();
                    refreshDisplay(event, {
                        ...props.displayState,
                        sectionSelectTableVisible: true,
                        sectionSelectButtonClickX: event.clientX,
                        sectionSelectButtonClickY: event.clientY
                    })
                }}></img>
            <SectionSelectTable displayState={props.displayState} />
        </span>
    )
}

export { SectionSelectButton };
