import React from 'react';
import Moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
//props:
//show (bool)
//data -- data to show
//onCancel -- function to do in case of cancel
//onSave -- function to do in case of save
//editFunc -- function to edit variables.
class ModalWindow extends React.Component {
    //todo: checkbox
    // getLiElement(e, liStyle) {
    //     let reqField = false;
    //     let addText = '';
    //     let disField = (e.title === "UUID");
    //     let inputType = typeof e.value === "boolean" ? "checkbox" : "text";
    //     if (e.title.includes("uuid")) {reqField = true; addText = '*';}
    //     return (
    //     <li style={liStyle}>
    //         <div className="divFloat">
    //             <div className="input">{e.title}{addText}</div>
    //             <input 
    //                 type={inputType}
    //                 // value={this.props.data[e.title]} 
    //                 value={e.value} 
    //                 onChange={(evt) => this.props.onEdit(evt)} 
    //                 className="inputText" 
    //                 name={e.title} 
    //                 alt={e.title} 
    //                 required={reqField}
    //                 disabled={disField}
    //             />
    //         </div>
    //     </li>
    //     );
    // };
    createElement = (key, value) => {
        if (typeof value === "string") return listTextItem(key, value, this.props.onChange);
        if (typeof value === "number") return listNumberItem(key, value, this.props.onChange);
        if (typeof value === "boolean") return listBooleanItem(key,value, this.props.onChange);
        if (value instanceof Moment) return listMomentItem(key, value, this.props.onChangeMoment)
    };

    render() {
        // Render nothing if the "show" prop is false
        if(!this.props.show) {
            return null;
        }
        let prepItems = [];
        for(let item in this.props.data) {
            prepItems.push(this.createElement(item, this.props.data[item]));
        };
        return (
            <div className="backdrop">
                <div className="modal">
                    <ul className="input-field">
                        {prepItems}
                    </ul>
                    <button className="button-me ok" onClick={this.props.onSave}>Save</button>
                    <button className="button-me cancel" onClick={this.props.onCancel}>Cancel</button>
                </div>
            </div>
        );
    }
};

const listTextItem = (key, value, onChange) => {
    return (
        <li key={key}>
            <div className="listItem">{key}</div>
            <input type="text" value={value} name={key} onChange={onChange} disabled={key==="uuid"}/>
        </li>
      );
};

const listNumberItem = (key, value, onChange) => {
    return (
        <li key={key}>
            <div className="listItem">{key}</div>
            <input type="number" value={value} name={key} onChange={onChange} />
        </li>
    )
};

const listBooleanItem = (key, value, onChange) => {
    return (
        <li key={key}>
            <div className="listItem">{key}</div>
            <input type="checkbox" checked={value} name={key} onChange={onChange} />
        </li>
    )
};

const listMomentItem = (key, value, onChangeMoment) => {
    return (
        <li key={key}>
            <div className="listItem">{key}</div>
            <DatePicker selected={value} name={key} onChange={(value) =>onChangeMoment(key, value)} />
        </li>
    )
}

// <ul style={ulStyle}>
// {fillMenu.map(e => {
//     return this.getLiElement(e, liStyle);
// })}
// </ul>
// <div style={buttonStyle}>
// <button className="button-me ok" onClick={() => this.props.onSave(this.props.data)}>Save</button>

// </div>

// eslint-disable-next-line
const ulStyle = {
    listStyleType: "none",
    width: "100%",
    padding: 0
};
// eslint-disable-next-line
const liStyle = {
    paddingTop: 2,
    marginBottom: 4
};
// eslint-disable-next-line
const buttonStyle = {
    textAlign: "center",
    marginLeft: '2px',
    marginRight: '2px'
};

export default ModalWindow;