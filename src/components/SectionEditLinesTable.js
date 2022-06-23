import React, { useState } from 'react';
import { SECTIONS } from '../services/working_data_setup';
import { performDataCUD } from '../services/business_logic';
import { SectionEditLine } from './SectionEditLine';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SectionEditLinesTable(props) {

    // based on https://codesandbox.io/s/k260nyxq9v?file=/index.js:42-75

    // build the editLines display

    function buildEditLines() {

        let sortedSections = [...SECTIONS];
        sortedSections.sort((a, b) => (a.dataObject.sectionSequenceNumber > b.dataObject.sectionSequenceNumber) ? 1 : ((b.dataObject.sectionSequenceNumber > a.dataObject.sectionSequenceNumber) ? -1 : 0));

        let sectionEditLines = [];
        sortedSections.forEach((section, index) => {
            sectionEditLines.push({
                id: 'item-' + index,
                content: section,
            });
        });

        return sectionEditLines
    }

    // we use a localStateObject to reference state from here because we can't rely on the asynch state update
    // (updateStateObject here) function to deliver the sectionEditLines objet when we need it

    let localStateObject = { items: buildEditLines() };

    const [stateObject, updateStateObject] = useState(localStateObject);

    // a little function to help us with reordering the result
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1); //removes the startIndex item from result and puts it in removed vafiable
        result.splice(endIndex, 0, removed); // puts the removed item back at endIndex

        return result;
    };

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",

        // change background colour if dragging
        background: isDragging ? "lightgreen" : "white",

        // styles we need to apply on draggables
        ...draggableStyle
    });

    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? "lightblue" : "lightgrey",
    });

    function onDragEnd(result) {

        // dropped outside the list
        if (!result.destination) {
            return;
        }

        // result.source.index tells you where the dragged item came from and
        // result.destination.index tells you where it has been dropped
        const items = reorder(
            localStateObject.items,
            result.source.index,
            result.destination.index
        );

        localStateObject = { ...localStateObject, items: items }

        // call CUD to get SECTIONSs updated with the new sequence numbers
        localStateObject.items.forEach(async (item, index) => {
            item.content.dataObject.sectionSequenceNumber = index;
            await performDataCUD("section", "U", item.content.dataObject, item.content.dataObjectId);
        });

        toast.success("Yay, sections re-ordered")

        updateStateObject(localStateObject);

    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity

    return (
        <div >
            <p style={{textAlign: 'center', fontWeight: 'bold'}}>Use 'Drag and Drop' to re-sequence Sections</p><br />
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                        >
                            {localStateObject.items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}
                                        >
                                                <SectionEditLine
                                                    section={item.content}
                                                    key={item.content.dataObjectId}
                                                />

                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <br />
        </div>
    );

}

export { SectionEditLinesTable };

