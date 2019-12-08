import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { deleteWireframeHandler } from '../../store/database/asynchHandler'
import { firestoreConnect } from 'react-redux-firebase';

class WireframeCard extends React.Component {
    delete(e) {
        e.preventDefault();
        const { props } = this;
        props.delete(this.props.wireframe)
    }

    render() {
        const { wireframe } = this.props;

        return (
            <div className="card transparent z-depth-0 todo-list-link"  >
                <div className="card-content grey-text text-darken-3 no-padding" >
                    <div className="row">
                        <div className="col s11 m9">
                            <span className="card-title font-15" >{wireframe.name}</span>
                        </div>
                        <div className="col s11 m2">
                            <span className="button font-15" onClick={(e) => this.delete(e)}>X</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    delete: (wireframe) => dispatch(deleteWireframeHandler(wireframe))
});

export default compose(
    connect(null, mapDispatchToProps))(WireframeCard);