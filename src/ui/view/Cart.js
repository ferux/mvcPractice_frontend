import React from 'react';
import propTypes from 'prop-types';

class Carts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                uuid: "",
                item_uuid: "",
                cart_uuid: ""
            }
        };
    };

    render() {
        return (
            <div className="centerBorder">
                <div>Sorry, not implemented yet</div>
            </div>
        );
    };
};

class CartsTable extends React.Component {
    render() {
        return <table></table>;
    }
}

CartsTable.PropTypes = {
    data: {
        uuid: propTypes.string,
        item_uuid: propTypes.string,
        cart_uuid: propTypes.string
    }
};

export default Carts;