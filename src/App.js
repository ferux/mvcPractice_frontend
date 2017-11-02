import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom';
import {Header, Footer} from './ui/staticui';
import Carts from './ui/view/Cart';
import Clients from './ui/view/Client';
import OrdersTable from './ui/view/Order';
import ItemsTable from './ui/view/Item';

const menuItems = [
  'Orders', 'Items', 'Clients', 'Carts'
];

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      aElement: ""
    };
  };

  changeActiveElement = (item) => {
    this.setState({
      aElement: item
    });
  };

  render() {
    return (
      <Router>
        <div>
          <Header><NavLink to="/">Shop ORM</NavLink></Header>
          <div className="navbar center">
            {menuItems.map(e => {
              let to = "/"+e;
              return ( 
                <NavLink to = {to} key={e} activeClassName="active" className="item">{e}</NavLink>
              )
            })}
          </div>
          <Route exact path="/" component={Home}/>
          <Route exact path="/orders" component={OrdersTable}/>
          <Route exact path="/items" component={ItemsTable}/>
          <Route exact path="/clients" component={Clients}/>
          <Route exact path="/carts" component={Carts}/>
          <Footer />
        </div>
      </Router>
    );
  };
};

const Home = () => {
  return(
    <div>Home tab</div>
  );
};

export default App