import { Modal, Button } from 'react-materialize';
import React from 'react';
import { Redirect } from 'react-router-dom'
import { deleteWireframeHandler } from '../../store/database/asynchHandler'
import { connect } from 'react-redux';
import { compose } from 'redux';


const trigger = <span className="button font-15">X</span>
class DeleteModal extends React.Component {
    confirmDelete(e) {
        e.preventDefault();
        const { props } = this;
        props.delete(this.props.wireframe);
    }
    cancelDelete(e) {
        e.preventDefault();
    }
    render() {
        return (
            <Modal header="Delete List" trigger={trigger} className="modal-style" actions={
                <div>
                    <Button waves="green" modal="close" flat onClick={(e)=>this.confirmDelete(e)}>Yes</Button>
                    <Button waves="red" modal="close" flat onClick={(e)=>this.cancelDelete(e)}>No</Button>
                </div>
            }>Are you sure you want to delete this list? The list will not be retrievable.</Modal>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    delete: (wireframe) => dispatch(deleteWireframeHandler(wireframe))
}); 

export default compose(
    connect(null, mapDispatchToProps))(DeleteModal);