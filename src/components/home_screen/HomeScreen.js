import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import WireframeListLinks from './WireframeLinks'
import { createWireframeHandler } from '../../store/database/asynchHandler'
import { updateWireframeHandler } from '../../store/database/asynchHandler'
import { objectTypeIndexer } from '@babel/types';

class HomeScreen extends Component {
    handleNewList = () => {       
        const { props } = this;
        const wireframe = { 
            owner: props.auth.email,
            name: "Unknown",
            height: 200,
            width: 200,
            controls: []
        }
        props.create(wireframe);
    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        return (
            <div className="dashboard container width-100">
                <div className="row">
                    <div className="col s4">
                        <span className="recentwork font-18"><br/>Recent Work</span>
                        <WireframeListLinks wireframes={this.props.wireframes} owner={this.props.auth.email}/>
                    </div>
                    <div className="col s7">
                        <div className="banner">
                            <span className="font-40">Wireframer<sup>TM</sup><br/><br/><br/>&nbsp;</span>
                        </div>
                        <div className="home_new_list_container">
                            <button className="home_new_list_button" onClick={this.handleNewList}>
                                Create New Wireframe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        wireframes: state.firestore.ordered.wireframes
    };
};

const mapDispatchToProps = dispatch => ({
    create: (wireframe) => dispatch(createWireframeHandler(wireframe)),
    update: (wireframe) => dispatch(updateWireframeHandler(wireframe))
});  

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'wireframes'}
    ])
)(HomeScreen);