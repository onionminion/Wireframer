import * as actionCreators from '../actions/actionCreators.js'

export const loginHandler = ({ credentials, firebase }) => (dispatch, getState) => {
    firebase.auth().signInWithEmailAndPassword(
        credentials.email,
        credentials.password,
    ).then(() => {
        console.log("LOGIN_SUCCESS");
        dispatch({ type: 'LOGIN_SUCCESS' });
    }).catch((err) => {
        dispatch({ type: 'LOGIN_ERROR', err });
    });
};

export const logoutHandler = (firebase) => (dispatch, getState) => {
    firebase.auth().signOut().then(() => {
        dispatch(actionCreators.logoutSuccess);
    });
};

export const registerHandler = (newUser, firebase) => (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firebase.auth().createUserWithEmailAndPassword(
        newUser.email,
        newUser.password,
    ).then(resp => firestore.collection('users').doc(resp.user.uid).set({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        initials: `${newUser.firstName[0]}${newUser.lastName[0]}`,
        isAdmin: false,
        email: newUser.email
    })).then(() => {
        dispatch(actionCreators.registerSuccess);
    }).catch((err) => {
        dispatch(actionCreators.registerError);
    });
};

export const createWireframeHandler = (wireframe) => (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firestore.collection('wireframes').add({
        owner: wireframe.owner,
        name: wireframe.name,
        height: wireframe.height,
        width: wireframe.width,
        controls: wireframe.controls
    }).then(() => {
        dispatch(actionCreators.createWireframe(wireframe));
    }).catch((err) => {
        dispatch(actionCreators.createWireframeError(err));
    });
}

export const updateWireframeHandler = (wireframe) => (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firestore.collection('wireframes').get().then(function (list) {
        list.forEach(function () {
            firestore.collection('wireframes').doc(wireframe.id).set({
                owner: wireframe.owner,
                name: wireframe.name,
                height: wireframe.height,
                width: wireframe.width,
                controls: wireframe.controls
            });
        });
    }).then(() => {
        dispatch(actionCreators.updateWireframeSuccess);
    }).catch((err) => {
        dispatch(actionCreators.updateWireframeError(err));
        console.log(err);
    });
};

export const deleteWireframeHandler = (wireframe) => (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firestore.collection('wireframes').doc(wireframe.id).delete(
    ).then(() => {
        dispatch(actionCreators.deleteWireframeSuccess);
    }).catch((err) => {
        dispatch(actionCreators.deleteWireframeError(err));
        console.log(err);
    });
};