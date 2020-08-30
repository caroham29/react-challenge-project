import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Template } from '../../components';
import { SERVER_IP } from '../../private';
import './viewOrders.css';

class ViewOrders extends Component {
    state = {
        blockPage: false,
        loading: true,
        orders: [],
        auth: {
            email: null,
            token: null
        }
    }

    formatDate = (dayTime = new Date()) => {  //Return date with two digit minutes and seconds ie. hh:mm:ss format
        let tempDayTime = new Date(dayTime);
        return tempDayTime.getHours() + ':' +
            ( !!(tempDayTime.getMinutes() > 9 ) ? tempDayTime.getMinutes() : ( '0' + tempDayTime.getMinutes() ) ) + ':' +
            ( !!(tempDayTime.getSeconds() > 9 ) ? tempDayTime.getSeconds() : ( '0' + tempDayTime.getSeconds() ) );
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
        const { formatDate, state } = this
        if (!!state.blockPage) {
            return <Redirect to="/" />
        }
        return (
            <div>
            { this.state.loading ?
                <div></div>
                :
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
                                         <button className="btn btn-success">Edit</button>
                                         <button className="btn btn-danger">Delete</button>
                                     </div>
                                </div>
                            );
                        })}
                    </div>
                </Template>
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
