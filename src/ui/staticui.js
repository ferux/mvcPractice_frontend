import React from 'react';
// import { Link } from 'react-router-dom';

export class Header extends React.Component {
    render() {
        return (<div className="header">{this.props.children}</div>);
    };
};

//props:
//changeElement(event) -- change the tab.
export class NavBar extends React.Component {
    render() {
        return (
            <div className="navbar center">
            {this.props.mItems.map(e => {
                let classArray = e === this.props.aElement ? "item active" : "item"
                return <div onClick={() => this.props.changeElement(e)} to="/static/{e}" className={classArray}>{e}</div>
            })}
            </div>
    )};
};

export class Footer extends React.Component {
    render() {
        return (
            <div className="footer"><a href="http://dev.loyso.tech">Loyso.tech &copy; 2017</a></div>
        );
    }
};

// export class Link extends React.Component {
//     render() {
//         return (<div>{this.props.children}</div>);
//     }
// }