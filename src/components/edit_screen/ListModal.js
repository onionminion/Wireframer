import { Modal, Button } from 'react-materialize';
import React from 'react';
import { Redirect } from 'react-router-dom'
import Trash from './icons/Trash.png';
import { deleteWireframeHandler } from '../../store/database/asynchHandler'
import { connect } from 'react-redux';
import { compose } from 'redux';


const trigger = <input type="image" src={Trash} />
class ListModal extends React.Component {
    state = {
        redirect: false
    }
    deleteList() {
        const { props } = this;
        props.delete(this.props.wireframe);
        this.setState({redirect: true});
    }
    render() {
        if (this.state.redirect)
            return <Redirect push to="/" />;
        return (
            <Modal header="Delete List" trigger={trigger} className="modal-style" actions={
                <div>
                    <Button waves="green" modal="close" flat onClick={()=>this.deleteList()}>Yes</Button>
                    <Button waves="red" modal="close" flat>No</Button>
                </div>
            }>Are you sure you want to delete this list? The list will not be retrievable.</Modal>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    delete: (wireframe) => dispatch(deleteWireframeHandler(wireframe))
}); 

export default compose(
    connect(null, mapDispatchToProps))(ListModal);