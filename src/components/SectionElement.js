import React from 'react';

function SectionElement(props) {

    return (

        <div>

            <label>&nbsp;&nbsp;Section id :&nbsp;</label>
            <input type='text' maxLength='10' size='8'
                style={props.stateObject.errorObject.sectionIdStyle}
                name='sectionId'
                value={props.stateObject.dataObject.sectionId}
                autoComplete='off'
                title='Enter a short tag for the section - eg finstats'
                onChange={props.handleChange} />&nbsp;&nbsp;&nbsp;

            <label>&nbsp;&nbsp;Section header :&nbsp;</label>
            <input type='text' maxLength='40' size='15'
                style={props.stateObject.errorObject.sectionHeaderStyle}
                name='sectionHeader'
                value={props.stateObject.dataObject.sectionHeader}
                autoComplete='off'
                title='Enter a heading for this section - eg Financial Statements and Accounts'
                onChange={props.handleChange} />&nbsp;&nbsp;&nbsp;

            <label>&nbsp;&nbsp;Section prefix :&nbsp;</label>
            <input type='text' maxLength='20' size='10'
                style={props.stateObject.errorObject.sectionPrefixStyle}
                name='sectionPrefix'
                value={props.stateObject.dataObject.sectionPrefix}
                autoComplete='off'
                title='For "date-type" sections enter the prefix for this section (if any) - eg "Minutes for : "'
                onChange={props.handleChange} />&nbsp;&nbsp;&nbsp;

            <label>&nbsp;&nbsp;Date type&nbsp;</label>
            <input type='radio'
                name='sectionType'
                value='date_title'
                checked={props.stateObject.dataObject.sectionType === "date_title"}
                title='Check this button to include a date in section entry titles'
                onChange={props.handleChange} />&nbsp;&nbsp;&nbsp;

            <label>&nbsp;&nbsp;Standard type&nbsp;</label>
            <input type='radio'
                name='sectionType'
                value='standard_title'
                checked={props.stateObject.dataObject.sectionType === "standard_title"}
                title='Check this button if you do not need dates in section entry titles'
                onChange={props.handleChange} />&nbsp;&nbsp;&nbsp;
        </div>
    );
}

export { SectionElement }