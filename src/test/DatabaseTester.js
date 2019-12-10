import React from 'react';
import { connect } from 'react-redux';
import testData from './TestData.json';
import { getFirestore } from 'redux-firestore';
import { Redirect } from 'react-router-dom';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';


class DatabaseTester extends React.Component {

    // NOTE, BY KEEPING THE DATABASE PUBLIC YOU CAN
    // DO THIS ANY TIME YOU LIKE WITHOUT HAVING
    // TO LOG IN
    handleClear = () => {
        console.log(this.props.users);
        const fireStore = getFirestore();
        fireStore.collection('wireframes').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                console.log("deleting " + doc.id);
                fireStore.collection('wireframes').doc(doc.id).delete();
            })
        });
    }

    handleReset = () => {
        const fireStore = getFirestore();
        testData.wireframes.forEach(testData => {
            fireStore.collection('wireframes').add({
                    owner: testData.owner,
                    name: testData.name,
                    priority: 0,
                    key: testData.key,
                    width: testData.width,
                    height: testData.height,
                    controls: testData.controls
                }).then(() => {
                    console.log("DATABASE RESET");
                }).catch((err) => {
                    console.log(err);
                });
        });
    }

    render() {
        if (!this.props.auth.uid) 
            return <Redirect to="/login" />;
        if (this.props.users !== undefined) {
            console.log(this.props.users.length);

            for (var i = 0; i < this.props.users.length; i++) {
                if (this.props.auth.email==this.props.users[i].email) {
                    if (this.props.users[i].isAdmin)
                        return (
                            <div>
                                <button onClick={this.handleClear}>Clear Database</button>
                                <button onClick={this.handleReset}>Reset Database</button>
                            </div>);
                    else 
                        return <Redirect to="/" />;
                }
            }         
        }
        return (
            <React.Fragment />);
    }
}

const mapStateToProps = function (state) {
    return {
        auth: state.firebase.auth,
        users: state.firestore.ordered.users,
        firebase: state.firebase
    };
}

export default compose(
    connect(mapStateToProps, null),
    firestoreConnect([
        { collection: 'users'}
    ])
)(DatabaseTester);