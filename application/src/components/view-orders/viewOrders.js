import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Template } from '../../components';
import { SERVER_IP } from '../../private';
import EditOrder from './edit-Order/editOrder';
import { formatDate } from '../../utils/utils';
import './viewOrders.css';

const EDIT_ORDER_URL = `${SERVER_IP}/api/edit-order`;

class ViewOrders extends Component {
    state = {
        loading: true,
        blockPage: false,
        showEditMod:false,
        orders: [],
        auth: {
            email: null,
            token: null
        },
        orderItem: {}

    }

    passedFunction = () => {
        this.setState({ showEditMod : false,  })
    }

    editOrder(obj) {
        this.setState({ orderItem:obj,  showEditMod : true })
    }

    saveEdit = ({  id, ordered_by, quantity, order_item }) => {
        this.setState((state,props) => (
           {
            showOrders: state.showOrders,
            orders: state.orders
                        .reduce((acc,it) => {
                            if (it._id === id) {
                                acc.push( Object.assign(
                                    it,
                                    { _id: id, quantity, order_item }
                                ))
                            } else {
                                acc.push(it);
                            }
                            return acc;
                        },[]),
            auth: state.auth,
            showEditMod : false
            }
        ))

        fetch(EDIT_ORDER_URL, {
            method: 'POST',
            body: JSON.stringify({
                id,
                order_item,
                quantity,
                ordered_by,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => console.log("Success", JSON.stringify(response)))
        .catch(error => console.error(error));
    }

    componentDidMount() {
        fetch(`${SERVER_IP}/api/current-orders`)
            .then(response => response.json())
            .then(response => {
                if(response.success) {
                    this.setState({ orders: response.orders });
                } else {
                    console.log('Error getting orders');
                }
                
            });

        setTimeout(() => {
            if ( !this.props.auth.token ) { //Redirect if token not found, otherwise load page
               this.setState({ blockPage: true })
            } else {
               this.setState({ loading: false })
            }
        },250);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!!this.props.auth.token && (this.props.auth.token !== prevProps.auth.token)) {
            this.setState((state,props) => (
               {
                showOrders: state.showOrders,
                orders: state.orders,
                auth: {
                    email: props.auth.email,
                    token: props.auth.token
                    } 
                }
            ));
        }
    }


    render() {
        const { state } = this
        if (!!state.blockPage) {
            return <Redirect to="/" />
        }
        return (
            <div>
            { this.state.loading ?
                <div></div>
                :
                <div>
                {
                    this.state.showEditMod &&
                    <EditOrder passedFunction={this.passedFunction} orderItem={state.orderItem} saveEdit={this.saveEdit}></EditOrder>
                }
                <Template>
                    <div className="container-fluid">
                        {this.state.orders.map(order => {
                            return (
                                <div className="row view-order-container" key={order._id}>
                                    <div className="col-md-4 view-order-left-col p-3">
                                        <h2>{order.order_item}</h2>
                                        <p>Ordered by: {order.ordered_by || ''}</p>
                                    </div>
                                    <div className="col-md-4 d-flex view-order-middle-col">
                                        <p>Order placed at {`${formatDate(order.createdAt)}`}</p>
                                        <p>Quantity: {order.quantity}</p>
                                     </div>
                                     <div className="col-md-4 view-order-right-col">
                                         <button onClick={() => this.editOrder(order)} className="btn btn-success">Edit</button>
                                         <button className="btn btn-danger">Delete</button>
                                     </div>
                                </div>
                            );
                        })}
                    </div>
                </Template>
                </div>
            }
            </div>
        );
    }
}

function mapStateToProps({auth}) {
    return {
        auth,
    }
}

export default connect(mapStateToProps)(ViewOrders)
