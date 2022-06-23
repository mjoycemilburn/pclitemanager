import React, { useState } from 'react';
import { SectionsManagementTable } from './SectionsManagementTable';

function SectionSelectButton(props) {


    let onclickCallbackForSectionSelectButton = (inputFromChild) => {
        updateStateObject({
            ...stateObject,
            sectionSelectButtonClicked: false
        })
    }

    return (
             <SectionSelectTable/>

    )
}

export { SectionSelectButton };
