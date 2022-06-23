
function SectionSelectTableItem(props) {

    if (props.sectionId === "cancel") {
        return (
            <span><br/>
            <span onClick={props.onClick}>{props.sectionId}
            </span>
            </span >
        )
    }
    return (
        <span onClick={props.onClick}>{props.sectionId}<br />
        </span>
    )
}

export { SectionSelectTableItem };