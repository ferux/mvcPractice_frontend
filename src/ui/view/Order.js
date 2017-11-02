import React from 'react';
import ModalWindow from '../modalWindow';
import propTypes from 'prop-types';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Urls from '../../func/Urls';

class OrdersTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            readyState: false,
            deletedRows: [],
            modify: false,
            modifyData: {},
            modifyId: -1,
            modifiedRows: [],
            modifyIsNew: false
        };
        this.getData();
    };

    simpleData = {
        uuid: "",
        cart_uuid: "",
        client_uuid: "",
        date: new moment(),
        is_payed: false,
        status: 0,
        status_date: new moment()
    };

    modifyType = {
        ADDED: 1,
        UPDATED: 2,
        DELETED: 3
    };

    getData = () => {
        fetch(`${Urls.api}/orders`)
        .then(response => {
            response.ok && response.json().then(data  => {
                this.setState({
                    data: data,
                    readyState: true,
                    deletedRows: [],
                    modify: false,
                    modifyData: {},
                    modifyId: -1,
                    modifiedRows: []
                });
            });
        })
        .catch(error => {
            console.log('Got an error while retrieving items: ', error);
            this.setState({
                readyState: false
            });
        });
    };

    setModifyData = (event) => {
        let value = undefined;
        const target = event.target;
        if (target.type === "checkbox") {
            value = target.checked;
        } else if (target.type === "number") {
            value = parseInt(target.value, 10);
        } else {
            value = target.value;
        }
        const name = target.name;
        let {modifyData} = this.state;
        modifyData[name] = value;
        this.setState({
            modifyData: modifyData
        });
    };

    setModifyDataDate = (key,value) => {
        let {modifyData} = this.state;
        modifyData[key] = value;
        this.setState({
            modifyData: modifyData
        });
    };

    deletedRow = (id) => {
        let state = this.state.modifiedRows.find(e => e.id === id);
        if (typeof state === "undefined") return false;
        return state.mType === this.modifyType.DELETED;
    };

    addDelete = (id) => {
        if (id === -1) return;
        let {modifiedRows} = this.state;
        let selectedRow = modifiedRows.find(e => e.id === id );
        if (typeof selectedRow === "undefined") {
            let data = {id: id, data: this.state.data[id], mType: this.modifyType.DELETED, prevType: undefined};
            modifiedRows.push(data);
            this.setState({
                modifiedRows: modifiedRows
            });
            return;
        }
        if (selectedRow.mType === this.modifyType.ADDED) {
            modifiedRows = modifiedRows.filter(e => e.id !== id);
            let {data} = this.state;
            data = data.filter(e => e !== selectedRow.data);
            this.setState({
                modifiedRows: modifiedRows,
                data: data
            });
            return;
        }
        if (selectedRow.mType === this.modifyType.UPDATED) {
            selectedRow.prevType = selectedRow.mType;
            selectedRow.mType = this.modifyType.DELETED;
            this.setState({
                modifiedRows: modifiedRows
            });
        }
        return;
    };

    cancelDelete = (id) => {
        if (this.deletedRow(id)) {
            let {modifiedRows} = this.state;
            let selectedRow = modifiedRows.find(e => e.id === id);
            if (typeof selectedRow.prevType !== "undefined") {
                selectedRow.mType = selectedRow.prevType;
                selectedRow.prevType = undefined;
            } else {
                modifiedRows = modifiedRows.filter(e => e !== selectedRow);
            }
            this.setState({
                modifiedRows: modifiedRows
            });
            return;
        }
    };

    toggleWindow = (id) => {
        if (this.state.modify) {
            this.defaultModify();
            return;
        };
        if (typeof id === "undefined") return;
        this.setState({
            modify: true,
            modifyData: this.state.data[id],
            modifyId: id
        });
    };

    addModify = () => {
        let {modifiedRows, modifyId, data, modifyData} = this.state;
        if (this.state.modifyIsNew) {
            modifiedRows.push({id: modifyId, data: modifyData, mType: this.modifyType.ADDED, prevType: undefined});
            this.setState({
                modifiedRows: modifiedRows
            });
            this.defaultModify();
            return;
        }

        let inModRows = false;
        let inModId = 0;
        data[modifyId] = modifyData;
        for (let item in modifiedRows)
            if (modifiedRows[item].id === modifyId) {
                inModId = item;
                inModRows = true;
                break;
            };
        if (!inModRows) {
            modifiedRows.push({id: modifyId, data: modifyData, mType: this.modifyType.UPDATED, prevType: undefined});
        } else {
            modifiedRows[inModId].data = modifyData;
            if (!modifiedRows[inModId].mType === this.modifyType.ADDED) {
                modifiedRows[inModId].prevType = this.modifyType.UPDATED;
            }
        }
        this.setState({
            data: data,
            modifiedRows: modifiedRows
        });
        this.defaultModify();
    };

    addElement = () => {
        let {modifyData, data, modifyId, modify} = this.state;
        modifyId = data.length;
        modify = true;
        Object.assign(modifyData, this.simpleData);
        data.push(modifyData);
        this.setState({
            modify: modify,
            modifyData: modifyData,
            modifyId: modifyId,
            data: data,
            modifyIsNew: true
        })
    };

    defaultModify = () => {
        this.setState({
            modify: false,
            modifyId: -1,
            modifyData: {},
            modifyIsNew: false
        });
    };

    saveEverything = () => {
        let {modifiedRows} = this.state;
        let toDelete = modifiedRows.filter(e => e.mType === this.modifyType.DELETED);
        let toModify = modifiedRows.filter(e => e.mType === this.modifyType.UPDATED);
        let toInsert = modifiedRows.filter(e => e.mType === this.modifyType.ADDED  );
        if (toDelete.length > 0) {
            let uuid_array = toDelete.map(e => e.data.uuid);
            let objJSON = JSON.stringify(uuid_array);
            this.fetchData("DELETE", objJSON);
        }
        if (toModify.length > 0) {
            let items_array = toModify.map(e => e.data);
            let objJSON = JSON.stringify(items_array);
            this.fetchData("POST", objJSON);
        }
        if (toInsert.length > 0) {
            let items_array = toInsert.map(e => e.data);
            items_array.forEach(e => {
                delete e.uuid;
                (e.cart_uuid.length === 0) && delete e.cart_uuid;
                (e.client_uuid.length === 0) && delete e.client_uuid;
            });
            let objJSON = JSON.stringify(items_array);
            this.fetchData("PUT", objJSON);
        }
    };

    fetchData = (method, data) => {
        fetch(`${Urls.api}/orders`, {
            method: method,
            body: data
        })
        .then(response => {
            response.ok && response.text().then(this.getData());
        }
        ).catch(error => console.log(`Can't perform action ${method}. Got an error: `, error));
    };

    render() {
        return (
            <div className="column middle">
                <table id="dataTable">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>UUID</th>
                            <th>Client UUID</th>
                            <th>Cart UUID</th>
                            <th>Date</th>
                            <th>Payed</th>
                            <th>Status</th>
                            <th>Status Date</th>
                            <th colSpan="2" className="divButtons">
                                <div className="bg">
                                    <ControlButton className="btn ok" onClick={this.addElement}>Add</ControlButton>
                                    <ControlButton className="btn save" onClick={this.saveEverything} disabled={this.state.modifiedRows.length === 0}>Save</ControlButton>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.readyState && this.state.data.map((item, id) => {
                            let modItem = item;
                            modItem.date = new moment(item.date);
                            modItem.status_date = new moment(item.status_date);
                            return <OrdersRow 
                                        deleted={this.deletedRow(id)} 
                                        addDelete={() => this.addDelete(id) } 
                                        cancelDelete={() => this.cancelDelete(id)} 
                                        toggleWindow={this.toggleWindow}
                                        key={id} 
                                        rowNum={id} 
                                        {...modItem}
                                    />
                        })}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <ModalWindow 
                    data={this.state.modifyData} 
                    show={this.state.modify} 
                    onCancel={this.toggleWindow} 
                    onSave={this.addModify}
                    onChange={this.setModifyData}
                    onChangeMoment={this.setModifyDataDate}/>
            </div>
        );
    };
};

OrdersTable.propTypes = {
    data: propTypes.object,
    readyState: propTypes.bool
};

class OrdersRow extends React.Component {
    render() {
        if (this.props.deleted) {
            return (
                <tr name={this.props.rowNum} className="table-row">
                    <td colSpan="10">Row has been deleted <span className="reverse" onClick={this.props.cancelDelete}>Undo &#x21a9;</span></td>
                </tr>
            );
        };
        return (
            <tr name={this.props.rowNum} className="table-row">
                <td>{parseInt(this.props.rowNum, 10)+1}</td>
                <td className="uuid">{this.props.uuid}</td>
                <td className="uuid">{this.props.client_uuid}</td>
                <td className="uuid">{this.props.cart_uuid}</td>
                <td>
                    <DatePicker selected={this.props.date} onChange={(date) => this.handleChange(date, true)} disabled/>
                </td>
                <td><input type="checkbox" checked={this.props.is_payed} disabled></input></td>
                <td>{this.props.status}</td>
                <td>
                    <DatePicker selected={this.props.status_date} onChange={(date) => this.handleChange(date, false)} disabled/>
                </td>
                <td onClick={() => this.props.toggleWindow(this.props.rowNum)} className="edit" ><div>&#x270e;</div></td>
                <td onClick={this.props.addDelete} className="delete"><div>&#x2715;</div></td>
            </tr>
        )};
};

OrdersRow.propTypes = {
    rowNum: propTypes.number,
    uuid: propTypes.string,
    client_uuid: propTypes.string,
    cart_uuid: propTypes.string,
    date: propTypes.instanceOf(moment),
    payed: propTypes.bool,
    status: propTypes.number,
    address: propTypes.string,
    status_date: propTypes.instanceOf(moment)
};

class ControlButton extends React.Component {
    render() {
        return <button className={this.props.className} onClick={this.props.onClick} disabled={this.props.disabled}>{this.props.children}</button>;
    }
};

export default OrdersTable;