import React from 'react';
import Moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class ModalWindow extends React.Component {
   
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
export default ModalWindow;
