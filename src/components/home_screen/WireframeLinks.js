import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeCard from './WireframeCard';
import firebase from 'firebase/app';
import { updateWireframeHandler } from '../../store/database/asynchHandler'
import { firestoreConnect } from 'react-redux-firebase';

class WireframeLinks extends React.Component {
    render() {
        if(!this.props.wireframes)
	        return <React.Fragment />
        const wireframes = []
        for (var i = 0; i < this.props.wireframes.length; i++) {
            if (this.props.wireframes[i].owner == this.props.owner)
                wireframes.push(this.props.wireframes[i]);
        }
        console.log(wireframes);

        return (
            <div className="wireframes section">
                {wireframes && wireframes.sort((a, b) => a.time < b.time).map(wireframe => (
                    <Link to={'/wireframe/' + wireframe.id} key={wireframe.id}>
                        <WireframeCard wireframe={wireframe} />
                    </Link>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
    };
};
const mapDispatchToProps = dispatch => ({
    update: (wireframe) => dispatch(updateWireframeHandler(wireframe))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'wireframes'}
    ])
)(WireframeLinks);