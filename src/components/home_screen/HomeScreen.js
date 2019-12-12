import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import WireframeListLinks from './WireframeLinks';
import { getFirestore } from 'redux-firestore';
import { updateWireframeHandler } from '../../store/database/asynchHandler';

class HomeScreen extends Component {
    id = null;
    state = {
        goToNew: false
    }
    handleNewList = () => {       
        const fireStore = getFirestore();
        fireStore.collection('wireframes').add({
            name: 'Unknown',
            owner: this.props.auth.email,
            height: 2000,
            width: 2000,
            controls: [],
            time: Date.now(),
        }).then(doc => {
            this.id = doc.id;
            this.setState({goToNew: true});
        });
    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        if (this.state.goToNew) {
            return <Redirect to={"/wireframe/"+this.id}/>;
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
    update: (wireframe) => dispatch(updateWireframeHandler(wireframe))
});  

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'wireframes' }
    ])
)(HomeScreen);