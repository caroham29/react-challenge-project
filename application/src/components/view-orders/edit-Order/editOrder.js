import React, { Component } from 'react';
import { formatDate } from '../../../utils/utils';
import '../viewOrders.css';

class EditOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blockPage: false,
            order_item: "",
            quantity: "1",
            id : null,
            ordered_by:'',
            createdAt: new Date()
        }
    }

    menuItemChosen(event) {
        this.setState({ order_item: event.target.value });
    }

    menuQuantityChosen(event) {
        this.setState({ quantity: event.target.value });
    }

    componentDidMount() {
        this.setState({
            order_item : this.props.orderItem.order_item,
            quantity : this.props.orderItem.quantity,
            ordered_by: this.props.orderItem.ordered_by,
            id: this.props.orderItem._id,
            shortId: this.props.orderItem._id.slice(0,7) + '...',
            created: this.props.orderItem.createdAt
        })
    }


    render() {
        return (
            <div>
                <div className="editItemMod">
                    <div className="form-wrapper">
                        <form>
                            <label className="form-label">Edit Order</label><br />
                            <label className="qty-label">Ordered ID:</label><span>{`${ this.state.shortId }`}</span><br />
                            <label className="qty-label">Ordered Time:</label><span>{`${formatDate(this.state.created)}`}</span><br />
                            <label className="qty-label">Order Item:</label>
                            <select 
                                value={this.state.order_item} 
                                onChange={(event) => this.menuItemChosen(event)}
                                className="menu-select"
                            >
                                <option value="" defaultValue disabled hidden>Lunch menu</option>
                                <option value="Soup of the Day">Soup of the Day</option>
                                <option value="Linguini With White Wine Sauce">Linguini With White Wine Sauce</option>
                                <option value="Eggplant and Mushroom Panini">Eggplant and Mushroom Panini</option>
                                <option value="Chili Con Carne">Chili Con Carne</option>
                            </select><br />
                            <label className="qty-label">Qty:</label>
                            <select value={this.state.quantity} onChange={(event) => this.menuQuantityChosen(event)}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                            </select><br />
                            <label className="qty-label">Ordered By:</label><span>{`${ this.state.ordered_by }`}</span>
                        </form>
                        <button className="btn btn-primary" onClick={() => this.props.saveEdit(this.state)}>Save Edit</button>
                        <button className="btn btn-light" onClick={e => this.props.passedFunction(e)}>Cancel and Close</button>
                    </div>
                </div>
                <div className="editModBlur"></div>
            </div>
        );
    }
}

export default EditOrder;