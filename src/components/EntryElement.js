import React from 'react';

function EntryElement(props) {

    return (

        <div>
            {props.section.dataObject.sectionType === "standard_title" &&
                <span>
                    <label>&nbsp;&nbsp;Entry Title :&nbsp;&nbsp;</label>
                    <input type='text' maxLength='40' size='20'
                        style={props.stateObject.errorObject.entryTitleStyle}
                        name='entryTitle'
                        value={props.stateObject.dataObject.entryTitle}
                        autoComplete='off'
                        title='Enter the title for this entry'
                        onChange={props.handleChange} />&nbsp;&nbsp;&nbsp;
                </span>
            }

            {props.section.dataObject.sectionType === "date_title" &&
                <span>
                    <label>&nbsp;&nbsp;{props.section.dataObject.sectionPrefix} :&nbsp;</label>
                    <input type="date"
                        style={props.stateObject.errorObject.entryDateStyle}
                        name='entryDate'
                        value={props.stateObject.dataObject.entryDate}
                        autoComplete='off'
                        title='Enter the date for this entry'
                        onChange={props.handleChange} />
                    <label>&nbsp;&nbsp;Suffix :&nbsp;&nbsp;</label>
                    <input type='text' maxLength='40' size='10'
                        style={props.stateObject.errorObject.entrySuffixStyle}
                        name='entrySuffix'
                        value={props.stateObject.dataObject.entrySuffix}
                        autoComplete='off'
                        title='Enter the suffix for this entry (if any)'
                        onChange={props.handleChange} />&nbsp;&nbsp;
                </span>
            }

        </div>
    );
}

export { EntryElement }