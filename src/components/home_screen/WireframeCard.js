import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { updateWireframeHandler } from '../../store/database/asynchHandler';
import { getFirestore } from 'redux-firestore';
import DeleteModal from './DeleteModal.js';

class WireframeCard extends React.Component {
    updateTime = (wireframe) => {
        wireframe.time = Date.now();
        this.props.update(wireframe);
    }
    render() {
        const { wireframe } = this.props;
        return (
            <div className="card transparent z-depth-0 todo-list-link" onClick={()=>this.updateTime(wireframe)}  >
                <div className="card-content grey-text text-darken-3 no-padding" >
                    <div className="row">
                        <div className="col s11 m9">
                            <span className="card-title font-12" >{wireframe.name}</span>
                        </div>
                        <div className="col s11 m2">
                            <DeleteModal className="col s1 margin" wireframe={wireframe} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    update: (wireframe) => dispatch(updateWireframeHandler(wireframe))
});

export default compose(
    connect(null, mapDispatchToProps))(WireframeCard);