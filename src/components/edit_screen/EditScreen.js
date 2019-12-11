import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ZoomIn from './icons/zoom_in.png';
import ZoomOut from './icons/zoom_out.png';
import { firestoreConnect } from 'react-redux-firebase';
import { updateWireframeHandler } from '../../store/database/asynchHandler';
import uuid from 'uuid';
import { Modal, Button } from 'react-materialize';


class EditScreen extends Component {
    controlDivs = [];
    state = {
        name: this.props.wireframe ? this.props.wireframe.name : "",
        owner: this.props.wireframe ? this.props.wireframe.owner : "",
        id: this.props.wireframe ? this.props.wireframe.id : "",
        height: this.props.wireframe ? this.props.wireframe.height : 0,
        width: this.props.wireframe ? this.props.wireframe.width : 0,
        controls: this.props.wireframe ? this.props.wireframe.controls : [],
        currentControl: null,
        currentBackColor: "black",
        currentTextColor: "black",
        currentBordColor: "black",
        redirect: false
    }

    updateFields = (e) => {
        const { target } = e;
        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }), () => this.handleUpdate());
    }
    handleUpdate = () => {
        var { props, state } = this;
        var wireframe = { ...state };
        props.update(wireframe);
    }
    changeBackColor = (e) => {
        this.setState({currentBackColor: e.target.value});
    }
    changeTextColor = (e) => {
        this.setState({currentTextColor: e.target.value});
    }
    changeBordColor = (e) => {
        this.setState({currentBordColor: e.target.value});
    }
    addContainer = () => {
        const controls = this.state.controls;
        const uniqueID = uuid.v4();
        const container = {
            type: "container",
            id: uniqueID,
            background_color: "#FFFFFF",
            border_color: "#000000",
            text_color: "#FFFFFF",
            border_thickness: "1px",
            border_radius: "2px",
            font_size: "0px",
            text: "",
            position_x: 0,
            position_y: 0,
            width: "115px",
            height: "60px",
            selected: false
        }
        controls.push(container);
        this.setState({controls});
        console.log(controls);
    }
    addLabel = () => {
        const controls = this.state.controls;
        const uniqueID = uuid.v4();
        const label = {
            type: "label",
            id: uniqueID,
            background_color: "#FFFFFF",
            border_color: "transparent",
            text_color: "#000000",
            border_thickness: "1px",
            border_radius: "1px",
            font_size: "10pt",
            text: "Prompt for input",
            position_x: 0,
            position_y: 0,
            width: "150px",
            height: "25px",
            selected: false
        }
        controls.push(label);
        this.setState({controls});
        console.log(controls);
    }
    addButton = () => {
        const controls = this.state.controls;
        const uniqueID = uuid.v4();
        const button = {
            type: "button",
            id: uniqueID,
            background_color: "#d8d8d8",
            border_color: "#000000",
            text_color: "#000000",
            border_thickness: "1px",
            border_radius: "2px",
            font_size: "10pt",
            text: "Submit",
            position_x: 0,
            position_y: 0,
            width: "100px",
            height: "25px",
            selected: false
        }
        controls.push(button);
        this.setState({controls});
        console.log(controls);
    }
    addTextfield = () => {
        const controls = this.state.controls;
        const uniqueID = uuid.v4();
        const textfield = {
            type: "textfield",
            id: uniqueID,
            background_color: "#FFFFFF",
            border_color: "#9e9e9e",
            text_color: "#808080",
            border_thickness: "1px",
            border_radius: "2px",
            font_size: "12pt",
            text: "Input",
            position_x: 0,
            position_y: 0,
            width: "170px",
            height: "25px",
            selected: false
        }
        controls.push(textfield);
        this.setState({controls});
        console.log(controls);
    }
    selectControl = (control) => {
        console.log(control);
        if (this.state.currentControl != null) {
            for (var i = 0; i < this.state.controls.length; i++) {
                if (this.state.controls[i].id == this.state.currentControl.id) {
                    const newControls = this.state.controls;
                    newControls[i].selected = false;
                    this.setState({controls: newControls});
                }
            }
        }
        for (var i = 0; i < this.state.controls.length; i++) {
            if (this.state.controls[i].id == control.id) {
                const newControls = this.state.controls;
                newControls[i].selected = true;
                this.setState({controls: newControls});
                this.setState({currentControl: newControls[i]});
            }
        }
    }
    saveWork = () => {
        const wireframe = {
            name: this.state.name,
            owner: this.state.owner,
            id: this.state.id,
            height: this.state.height,
            width: this.state.width,
            controls: this.state.controls,
        }
        this.props.update(wireframe);
        this.buildDivs();
    }
    saveBeforeClose = () => {
        this.saveWork();
        this.close();
    }
    close = () => {
        this.setState({redirect: true});
    }
    render() {
        const auth = this.props.auth;
        const wireframe = this.props.wireframe;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }
        if (!wireframe)
            return <React.Fragment />;
        if (this.state.redirect)
            return <Redirect push to="/"/>;
        return (
            <div className="container white width-100">
                <div className="row header-style">
                    <div className="col s11 grey-text text-darken-3 font-17">Todo List</div>
                </div>
                <div className="input-field padding-17">
                    <label htmlFor="name" className="active padding-17">Name</label>
                    <input className="active" type="text" name="name" id="name" onChange={this.updateFields} defaultValue={wireframe.name} />
                </div>
                <div className="input-field padding-17">
                    <label htmlFor="owner" className="active padding-17">Owner</label>
                    <input className="active" type="text" name="owner" id="owner" onChange={this.updateFields} defaultValue={wireframe.owner} />
                </div>
                <div className="row">
                    <div className="leftside col s3 grey lighten-3 zoom">
                        <div className="row margin-0">
                            <div className="col s5 grey lighten-3 no-padding">
                                <input type="image" src={ZoomIn} />
                                <input type="image" src={ZoomOut} />
                            </div>
                            <div className="col s3 save clickable" onClick={()=>this.saveWork()}><span>Save</span></div>
                            <div className="col s3 save clickable">
                                <Modal header="Close Edit Screen" trigger={<span>Close</span>} className="modal-style" actions={
                                    <div>
                                        <Button waves="green" modal="close" flat onClick={()=>this.saveBeforeClose()}>Save</Button>
                                        <Button waves="red" modal="close" flat onClick={()=>this.close()}>Close</Button>
                                    </div>
                                }>Do you want to save your work before closing?</Modal>
                            </div>
                        </div>
                        <span>&nbsp;<br/><br/></span>
                        <div className="row margin-0 clickable" onClick={()=>this.addContainer()}>
                            <div className="dis-container" style={{margin: "auto", width: "50%"}}></div>
                            <span style={{margin: "auto", display: "table"}}>Container</span>
                        </div>
                        <span>&nbsp;<br/><br/></span>
                        <div className="row margin-0 clickable" onClick={()=>this.addLabel()}>
                            <span className="dis-label" style={{margin: "auto", display: "table", fontSize: "10pt"}}>Prompt for input:</span>
                            <span style={{margin: "auto", display: "table"}}>Label</span>
                        </div>
                        <span>&nbsp;<br/><br/></span>
                        <div className="row margin-0 clickable" onClick={()=>this.addButton()}>
                            <div className="dis-button">Submit</div>
                            <span style={{margin: "auto", display: "table"}}>Button</span>
                        </div>
                        <span>&nbsp;<br/><br/></span>
                        <div className="row margin-0 clickable" onClick={()=>this.addTextfield()}>
                            <input type="text" className="dis-txt clickable" value="Input" readOnly ></input>
                            <span style={{margin: "auto", display: "table"}}>Textfield</span>
                        </div>
                        <span style={{fontSize: "13pt"}}>&nbsp;<br/><br/><br/></span>
                    </div>
                    <div className="mid col s6 white">
                        <div className="diagram">
                            {this.state.controls.map(control => {
                                if (control.type == "textfield") {
                                    return(
                                        <div key={control.id} style={{position: "relative", width: control.width, height: control.height}} onClick={()=>this.selectControl(control)} >
                                            <input type="text" defaultValue={control.text} readOnly style={{
                                                backgroundColor: control.background_color,
                                                borderStyle: "solid",
                                                borderColor: control.border_color,
                                                borderRadius: control.border_radius,
                                                color: control.text_color,
                                                borderWidth: control.border_thickness,
                                                fontSize: control.font_size,
                                                width: control.width,
                                                height: control.height,
                                                cursor: "pointer",
                                                position: "relative",
                                                marginBottom: "7px"}}>
                                            </input>
                                            <div className="rect top_left" style={control.selected ? this.showRect : {display: "none"}}></div>
                                            <div className="rect top_right" style={control.selected ? this.showRect : {display: "none"}}></div>
                                            <div className="rect bottom_left" style={control.selected ? this.showRect : {display: "none"}}></div>
                                            <div className="rect bottom_right" style={control.selected ? this.showRect : {display: "none"}}></div>
                                        </div>
                                    );
                                }
                                else {
                                    return(
                                        <div key={control.id} onClick={()=>this.selectControl(control)} style={{
                                            backgroundColor: control.background_color,
                                            borderStyle: "solid",
                                            borderColor: control.border_color,
                                            borderRadius: control.border_radius,
                                            color: control.text_color,
                                            borderWidth: control.border_thickness,
                                            fontSize: control.font_size,
                                            width: control.width,
                                            height: control.height,
                                            cursor: "pointer",
                                            position: "relative",
                                            textAlign: "center",
                                            marginBottom: "7px"}}
                                        >{control.text} 
                                        <div className="rect top_left" style={control.selected ? this.showRect : {display: "none"}}></div>
                                        <div className="rect top_right" style={control.selected ? this.showRect : {display: "none"}}></div>
                                        <div className="rect bottom_left" style={control.selected ? this.showRect : {display: "none"}}></div>
                                        <div className="rect bottom_right" style={control.selected ? this.showRect : {display: "none"}}></div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                    <div className="rightside col s3 grey lighten-3">Properties
                        <span>&nbsp;<br/><br/></span>
                        <div className="row margin-0">
                            <input type="text" className="txtctrl" value="value"></input>
                        </div>
                        <span>&nbsp;<br/></span>
                        <div className="row margin-0">
                            <div className="col s7" style={{fontSize: "10pt", marginTop: "0.5%"} }>Font Size:</div>
                            <input type="text" id="font" className="col s3 offset-s2 txtfont" value="value"></input>
                        </div>
                        <span>&nbsp;<br/></span>
                        <div className="row margin-0">
                            <div className="col s9" style={{fontSize: "10pt", marginTop: "2%"}}>Background:</div>
                            <label className="col s3 colorcircle" style={{backgroundColor: this.state.currentBackColor}}>
                                <input type="color" className="colorpicker" onChange={(e)=>this.changeBackColor(e)}></input>
                            </label>
                        </div>
                        <span>&nbsp;<br/></span>
                        <div className="row margin-0">
                            <div className="col s9" style={{fontSize: "10pt", marginTop: "2%"}}>Text Color:</div>
                            <label className="col s3 colorcircle" style={{backgroundColor: this.state.currentTextColor}}>
                                <input type="color" className="colorpicker" onChange={(e)=>this.changeTextColor(e)}></input>
                            </label>
                        </div>
                        <span>&nbsp;<br/></span>
                        <div className="row margin-0">
                            <div className="col s9" style={{fontSize: "10pt", marginTop: "2%"}}>Border Color:</div>
                            <label className="col s3 colorcircle" style={{backgroundColor: this.state.currentBordColor}}>
                                <input type="color" className="colorpicker" onChange={(e)=>this.changeBordColor(e)}></input>
                            </label>
                        </div>
                        <span>&nbsp;<br/></span>
                        <div className="row margin-0">
                            <div className="col s7" style={{fontSize: "10pt", marginTop: "0.5%"} }>Border Thickness:</div>
                            <input type="text" id="font" className="col s3 offset-s2 txtfont" value="value" style={{marginTop: "4.4%"}}></input>
                        </div>
                        <span>&nbsp;<br/></span>
                        <div className="row margin-0">
                            <div className="col s7" style={{fontSize: "10pt", marginTop: "0.5%"} }>Border Radius:</div>
                            <input type="text" id="font" className="col s3 offset-s2 txtfont" value="value" style={{marginTop: "4.4%"}}></input>
                        </div>
                        <span>&nbsp;<br/></span>
                        <div className="row margin-0">
                            <div className="col s7" style={{fontSize: "10pt", marginTop: "0.5%"} }>Width:</div>
                            <input type="text" id="font" className="col s3 offset-s2 txtfont" value="value"></input>
                        </div>
                        <span>&nbsp;<br/></span>
                        <div className="row margin-0">
                            <div className="col s7" style={{fontSize: "10pt", marginTop: "0.5%"} }>Height:</div>
                            <input type="text" id="font" className="col s3 offset-s2 txtfont" value="value"></input>
                        </div>
                        <span style={{fontSize: "11.7pt"}}>&nbsp;<br/></span>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;
    const wireframes = state.firestore.ordered.wireframes;
    let wireframe = null;
    if (wireframes) {
        for (let i in wireframes) {
            if (wireframes[i].id === id)
                wireframe = wireframes[i];
        }
    }
    if (wireframe)
        wireframe.id = id;
    return {
        wireframe,
        auth: state.firebase.auth,
    };
};

const mapDispatchToProps = dispatch => ({
    update: (wireframe) => dispatch(updateWireframeHandler(wireframe)),
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'wireframes' }
    ]),
)(EditScreen);