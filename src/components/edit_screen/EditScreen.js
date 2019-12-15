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
import { Rnd } from 'react-rnd';
import { transform } from '@babel/core';


class EditScreen extends Component {
    state = {
        name: this.props.wireframe ? this.props.wireframe.name : "",
        owner: this.props.wireframe ? this.props.wireframe.owner : "",
        id: this.props.wireframe ? this.props.wireframe.id : "",
        height: this.props.wireframe ? this.props.wireframe.height : 4500,
        width: this.props.wireframe ? this.props.wireframe.width : 4500,
        controls: this.props.wireframe ? this.props.wireframe.controls : [],
        currentControl: null,
        currentText: "",
        currentFontSize: "",
        currentBackColor: "",
        currentTextColor: "",
        currentBordColor: "",
        currentBordThick: "",
        currentBordRad: "",
        saved: true,
        disWidth: this.props.wireframe ? this.props.wireframe.width : 4500,
        disHeight: this.props.wireframe ? this.props.wireframe.height : 4500,
        updateDims: false,
        redirect: false,
        zoomNum: 1.0,
    }
    updateName = (e) => {
        this.setState({ name: e.target.value });
        this.setState({ saved: false });
    }
    handleUpdate = () => {
        var { props, state } = this;
        var wireframe = { ...state };
        props.update(wireframe);
    }
    changeText = (e) => {
        if (this.state.currentControl != null) {
            this.setState({ currentText: e.target.value });
            for (var i = 0; i < this.state.controls.length; i++) {
                if (this.state.controls[i].id == this.state.currentControl.id) {
                    const newControls = this.state.controls;
                    newControls[i].text = e.target.value;
                    this.setState({ controls: newControls });
                    this.setState({ currentControl: newControls[i] });
                    this.setState({ saved: false });

                }
            }
        }
    }
    changeBackColor = (e) => {
        if (this.state.currentControl != null) {
            this.setState({ currentBackColor: e.target.value });
            for (var i = 0; i < this.state.controls.length; i++) {
                if (this.state.controls[i].id == this.state.currentControl.id) {
                    const newControls = this.state.controls;
                    newControls[i].background_color = e.target.value;
                    this.setState({ controls: newControls });
                    this.setState({ currentControl: newControls[i] });
                    this.setState({ saved: false });
                }
            }
        }
    }
    changeTextColor = (e) => {
        if (this.state.currentControl != null) {
            this.setState({ currentTextColor: e.target.value });
            for (var i = 0; i < this.state.controls.length; i++) {
                if (this.state.controls[i].id == this.state.currentControl.id) {
                    const newControls = this.state.controls;
                    newControls[i].text_color = e.target.value;
                    this.setState({ controls: newControls });
                    this.setState({ currentControl: newControls[i] });
                    this.setState({ saved: false });
                }
            }
        }
    }
    changeBordColor = (e) => {
        if (this.state.currentControl != null) {
            this.setState({ currentBordColor: e.target.value });
            for (var i = 0; i < this.state.controls.length; i++) {
                if (this.state.controls[i].id == this.state.currentControl.id) {
                    const newControls = this.state.controls;
                    newControls[i].border_color = e.target.value;
                    this.setState({ controls: newControls });
                    this.setState({ currentControl: newControls[i] });
                    this.setState({ saved: false });
                }
            }
        }
    }
    changeBordThick = (e) => {
        if (this.state.currentControl != null) {
            var thickness = 0;
            if (e.target.value != "")
                thickness = e.target.value;
            this.setState({ currentBordThick: e.target.value });
            for (var i = 0; i < this.state.controls.length; i++) {
                if (this.state.controls[i].id == this.state.currentControl.id) {
                    const newControls = this.state.controls;
                    newControls[i].border_thickness = thickness;
                    this.setState({ controls: newControls });
                    this.setState({ currentControl: newControls[i] });
                    this.setState({ saved: false });
                }
            }
        }
    }
    changeBordRad = (e) => {
        if (this.state.currentControl != null) {
            var rad = 0;
            if (e.target.value != "")
                rad = e.target.value;
            this.setState({ currentBordRad: e.target.value });
            for (var i = 0; i < this.state.controls.length; i++) {
                if (this.state.controls[i].id == this.state.currentControl.id) {
                    const newControls = this.state.controls;
                    newControls[i].border_radius = rad;
                    this.setState({ controls: newControls });
                    this.setState({ currentControl: newControls[i] });
                    this.setState({ saved: false });
                }
            }
        }
    }
    changeFontSize = (e) => {
        if (this.state.currentControl != null && Number.isInteger(+e.target.value)) {
            var size = 0;
            if (e.target.value != "")
                size = e.target.value;
            this.setState({ currentFontSize: e.target.value });
            for (var i = 0; i < this.state.controls.length; i++) {
                if (this.state.controls[i].id == this.state.currentControl.id) {
                    const newControls = this.state.controls;
                    newControls[i].font_size = size;
                    this.setState({ controls: newControls });
                    this.setState({ currentControl: newControls[i] });
                    this.setState({ saved: false });
                }
            }
        }
    }
    changeWidth = (e) => {
        this.setState({ disWidth: e.target.value });
        this.setState({ updateDims: true });
    }
    changeHeight = (e) => {
        this.setState({ disHeight: e.target.value });
        this.setState({ updateDims: true });
    }
    updateDims = () => {
        if (this.state.disWidth != "" && Number.isInteger(+this.state.disWidth) && (+this.state.disWidth >= 1) && (+this.state.disWidth <= 5000)
            && this.state.disHeight != "" && Number.isInteger(+this.state.disHeight) && (+this.state.disHeight >= 1) && (+this.state.disHeight <= 5000)) {
            this.setState({ width: this.state.disWidth });
            this.setState({ height: this.state.disHeight });
        }
        this.setState({ updateDims: false });
    }
    addContainer = () => {
        const controls = this.state.controls;
        const container = {
            type: "container",
            background_color: "#FFFFFF",
            border_color: "#000000",
            text_color: "#FFFFFF",
            border_thickness: 1,
            border_radius: 2,
            font_size: 0,
            text: "",
            position_x: 0,
            position_y: 0,
            width: "115px",
            height: "60px",
            selected: false
        }
        controls.push(container);
        this.setState({ controls });
        this.setState({ saved: false });
    }
    addLabel = () => {
        const controls = this.state.controls;
        const label = {
            type: "label",
            background_color: "#FFFFFF",
            border_color: "#FFFFFF",
            text_color: "#000000",
            border_thickness: 1,
            border_radius: 1,
            font_size: 10,
            text: "Prompt for input",
            position_x: 0,
            position_y: 0,
            width: "150px",
            height: "25px",
            selected: false
        }
        controls.push(label);
        this.setState({ controls });
        this.setState({ saved: false });
    }
    addButton = () => {
        const controls = this.state.controls;
        const button = {
            type: "button",
            background_color: "#d8d8d8",
            border_color: "#000000",
            text_color: "#000000",
            border_thickness: 1,
            border_radius: 2,
            font_size: 10,
            text: "Submit",
            position_x: 0,
            position_y: 0,
            width: "100px",
            height: "25px",
            selected: false
        }
        controls.push(button);
        this.setState({ controls });
        this.setState({ saved: false });
    }
    addTextfield = () => {
        const controls = this.state.controls;
        const textfield = {
            type: "textfield",
            background_color: "#FFFFFF",
            border_color: "#9e9e9e",
            text_color: "#808080",
            border_thickness: 1,
            border_radius: 2,
            font_size: 12,
            text: "Input",
            position_x: 0,
            position_y: 0,
            width: "170px",
            height: "25px",
            selected: false
        }
        controls.push(textfield);
        this.setState({ controls });
        this.setState({ saved: false });
    }
    deleteControl = (e) => {
        if (e.key == "Delete" && this.state.currentControl != null) {
            e.preventDefault();
            const newControls = [];
            for (var i = 0; i < this.state.controls.length; i++) {
                if (this.state.controls[i].id != this.state.currentControl.id) {
                    newControls.push(this.state.controls[i]);
                }
            }
            this.setState({ controls: newControls });
            this.setState({ saved: false });
            this.unselect();
        }
    }
    duplicateControl = (e) => {
        if (e.ctrlKey && e.key == "d") {
            const uniqueID = uuid.v4();
            e.preventDefault();
            const controlCopy = { ...this.state.currentControl };
            controlCopy.position_x += 100;
            controlCopy.position_y += 100;
            controlCopy.id = uniqueID;
            const newControls = this.state.controls;
            newControls.push(controlCopy);
            this.setState({ controls: newControls });
            this.selectControl(controlCopy);
            this.setState({ saved: false });
        }
    }
    selectControl = (control) => {
        if (this.state.currentControl != null && this.state.currentControl.id != control.id) {
            for (var i = 0; i < this.state.controls.length; i++) {
                if (this.state.controls[i].id == this.state.currentControl.id) {
                    const newControls = this.state.controls;
                    newControls[i].selected = false;
                    this.setState({ controls: newControls });
                }
            }
        }

        for (var i = 0; i < this.state.controls.length; i++) {
            if (this.state.controls[i].id == control.id) {
                const newControls = this.state.controls;
                newControls[i].selected = true;
                this.setState({ controls: newControls });
                this.setState({ currentControl: newControls[i] });
            }
        }
        this.setState({ currentText: control.text });
        this.setState({ currentFontSize: control.font_size });
        this.setState({ currentBackColor: control.background_color });
        this.setState({ currentBordColor: control.border_color });
        this.setState({ currentTextColor: control.text_color });
        this.setState({ currentBordRad: control.border_radius });
        this.setState({ currentBordThick: control.border_thickness });
    }
    unselect = () => {
        const newControls = this.state.controls;
        for (var i = 0; i < this.state.controls.length; i++) {
            newControls[i].selected = false;
        }
        this.setState({ currentControl: null });
        this.setState({ currentText: "" });
        this.setState({ currentFontSize: "" });
        this.setState({ currentBackColor: "" });
        this.setState({ currentBordColor: "" });
        this.setState({ currentTextColor: "" });
        this.setState({ currentBordRad: "" });
        this.setState({ currentBordThick: "" });
        this.setState({ controls: newControls });
    }
    updatePos = (e, data) => {
        for (var i = 0; i < this.state.controls.length; i++) {
            if (this.state.controls[i].id == this.state.currentControl.id) {
                const newControls = this.state.controls;
                newControls[i].position_x = data.x;
                newControls[i].position_y = data.y;
                this.setState({ controls: newControls });
                this.setState({ currentControl: newControls[i] });
                this.setState({ saved: false });
            }
        }
    }
    updateSize = (ref, position) => {
        for (var i = 0; i < this.state.controls.length; i++) {
            if (this.state.controls[i].id == this.state.currentControl.id) {
                const newControls = this.state.controls;
                newControls[i].position_x = position.x;
                newControls[i].position_y = position.y;
                newControls[i].width = ref.style.width;
                newControls[i].height = ref.style.height;
                this.setState({ controls: newControls });
                this.setState({ currentControl: newControls[i] });
                this.setState({ saved: false });
                this.selectControl(newControls[i]);
            }
        }
    }
    zoom = (type) => {
        if (type == "in") {
            var zoom = this.state.zoomNum * 2;
            this.setState({ zoomNum: zoom });
        }
        else {
            var zoom = this.state.zoomNum * 0.5;
            this.setState({ zoomNum: zoom });
        }
    }
    saveWork = () => {
        this.unselect();
        this.setState({ saved: true });
        const wireframe = {
            name: this.state.name,
            owner: this.state.owner,
            id: this.state.id,
            height: this.state.height,
            width: this.state.width,
            controls: this.state.controls,
            time: Date.now()
        }
        this.props.update(wireframe);
    }
    saveBeforeClose = () => {
        this.saveWork();
        this.close();
    }
    close = () => {
        this.setState({ controls: [] });
        this.setState({ redirect: true });
    }
    render() {
        const auth = this.props.auth;
        const wireframe = this.props.wireframe;
        document.onkeyup = this.deleteControl;
        document.onkeydown = this.duplicateControl;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }
        if (auth.email != this.state.owner) 
            return <Redirect to="/" />;
        if (!wireframe)
            return <React.Fragment />;
        if (this.state.redirect)
            return <Redirect push to="/" />;
        return (
            <div className="container white width-100">
                <div className="input-field" style={{ fontSize: "15pt" }}>
                    Name:
                    <input className="active" type="text" onChange={(e) => this.updateName(e)} value={this.state.name} />
                </div>
                <div className="col s2 grey lighten-3" style={{padding: "0.3rem", display: "table", maxWidth: "50%", minWidth: "10px"}}>
                    {this.state.zoomNum}x
                </div>
                <div className="row">
                    <div className="leftside col s3 grey lighten-3 zoom" style={{ height: "570px" }}>
                        <div className="row margin-0">
                            <input type="image" className="col s2 no-padding" src={ZoomIn} onClick={() => this.zoom("in")} />
                            <input type="image" className="col s2 no-padding" src={ZoomOut} onClick={() => this.zoom("out")} />
                            <div className="col s3 offset-s1 save clickable" onClick={() => this.saveWork()}><span>Save</span></div>
                            <div className="col s3 save clickable">
                                {this.state.saved ? <span onClick={() => this.close()}>Close</span> :
                                    <Modal header="Close Edit Screen" trigger={<span>Close</span>} className="modal-style" actions={
                                        <div>
                                            <Button waves="green" modal="close" flat onClick={() => this.saveBeforeClose()}>Save and close</Button>
                                            <Button waves="red" modal="close" flat onClick={() => this.close()}>Close without saving</Button>
                                        </div>
                                    }>Do you want to save your work before closing?</Modal>}
                            </div>
                        </div>
                        <span>&nbsp;<br /><br /></span>
                        <div className="row margin-0 clickable" onClick={() => this.addContainer()}>
                            <div className="dis-container" style={{ margin: "auto", width: "50%" }}></div>
                            <span style={{ margin: "auto", display: "table" }}>Container</span>
                        </div>
                        <span>&nbsp;<br /><br /></span>
                        <div className="row margin-0 clickable" onClick={() => this.addLabel()}>
                            <span className="dis-label" style={{ margin: "auto", display: "table", fontSize: "10pt" }}>Prompt for input:</span>
                            <span style={{ margin: "auto", display: "table" }}>Label</span>
                        </div>
                        <span>&nbsp;<br /><br /></span>
                        <div className="row margin-0 clickable" onClick={() => this.addButton()}>
                            <div className="dis-button">Submit</div>
                            <span style={{ margin: "auto", display: "table" }}>Button</span>
                        </div>
                        <span>&nbsp;<br /><br /></span>
                        <div className="row margin-0 clickable" onClick={() => this.addTextfield()}>
                            <input type="text" className="dis-txt clickable" value="Input" readOnly ></input>
                            <span style={{ margin: "auto", display: "table" }}>Textfield</span>
                        </div>
                        <span style={{ fontSize: "13pt" }}>&nbsp;<br /><br /><br /></span>
                    </div>
                    <div className="mid col s6 white no-padding" style={{ overflow: "auto"}}>
                        <div className="diagram" id="diagram" onClick={() => this.unselect()}
                            style={{
                                width: (this.state.width / 10) + "px", height: (this.state.height / 10) + "px",
                                transform: `scale( ${this.state.zoomNum} )`, transformOrigin: "0 0"
                            }}>
                            {this.state.controls && this.state.controls.map(control => {
                                const uniqueID = uuid.v4();
                                control.id = uniqueID;
                                if (control.type == "textfield") {
                                    return (
                                        <Rnd size={{ width: control.width, height: control.height }}
                                            onDragStart={() => this.selectControl(control)}
                                            onDragStop={(e, data) => { this.updatePos(e, data); this.selectControl(control); }}
                                            default={{ x: control.position_x, y: control.position_y }}
                                            bounds="#diagram"
                                            scale={this.state.zoomNum}
                                            enableResizing={{ top: false, right: false, bottom: false, left: false, topRight: true, bottomRight: true, bottomLeft: true, topLeft: true }}
                                            onResizeStart={() => this.selectControl(control)}
                                            onResize={(e, direction, ref, delta, position) => this.updateSize(ref, position)}>
                                            <div key={control.id} style={{ position: "absolute", width: control.width, height: control.height }} >
                                                <input type="text" defaultValue={control.text} readOnly style={{
                                                    backgroundColor: control.background_color,
                                                    borderStyle: "solid",
                                                    borderBottomStyle: "solid",
                                                    borderBottomColor: control.border_color,
                                                    borderBottomWidth: control.border_thickness + "px",
                                                    borderColor: control.border_color,
                                                    borderRadius: control.border_radius + "px",
                                                    color: control.text_color,
                                                    borderWidth: control.border_thickness + "px",
                                                    fontSize: control.font_size + "pt",
                                                    width: control.width,
                                                    height: control.height,
                                                    cursor: "pointer",
                                                    position: "position"
                                                }}></input>
                                                <div className="rect top_left" style={control.selected ? null : { display: "none" }}></div>
                                                <div className="rect top_right" style={control.selected ? null : { display: "none" }}></div>
                                                <div className="rect bottom_left" style={control.selected ? null : { display: "none" }}></div>
                                                <div className="rect bottom_right" style={control.selected ? null : { display: "none" }}></div>
                                            </div>
                                        </Rnd>
                                    );
                                }
                                else {
                                    return (
                                        <Rnd size={{ width: control.width, height: control.height }}
                                            onDragStart={() => this.selectControl(control)}
                                            onDragStop={(e, data) => { this.updatePos(e, data); this.selectControl(control); }}
                                            default={{ x: control.position_x, y: control.position_y }}
                                            bounds="#diagram"
                                            scale={this.state.zoomNum}
                                            enableResizing={{ top: false, right: false, bottom: false, left: false, topRight: true, bottomRight: true, bottomLeft: true, topLeft: true }}
                                            onResizeStart={() => this.selectControl(control)}
                                            onResize={(e, direction, ref, delta, position) => this.updateSize(ref, position)}>
                                            <div key={control.id} style={{
                                                backgroundColor: control.background_color,
                                                borderStyle: "solid",
                                                borderColor: control.border_color,
                                                borderRadius: control.border_radius + "px",
                                                color: control.text_color,
                                                borderWidth: control.border_thickness + "px",
                                                fontSize: control.font_size + "pt",
                                                width: control.width,
                                                height: control.height,
                                                cursor: "pointer",
                                                position: "absolute",
                                                textAlign: "center",
                                            }}>{control.text}
                                                <div className="rect top_left" style={control.selected ? null : { display: "none" }}></div>
                                                <div className="rect top_right" style={control.selected ? null : { display: "none" }}></div>
                                                <div className="rect bottom_left" style={control.selected ? null : { display: "none" }}></div>
                                                <div className="rect bottom_right" style={control.selected ? null : { display: "none" }}></div>
                                            </div>
                                        </Rnd>
                                    )
                                }
                            })}
                        </div>
                    </div>
                    <div className="rightside col s3 grey lighten-3" style={{ height: "570px" }}>Properties
                        <span>&nbsp;<br /><br /></span>
                        <div className="row margin-0">
                            <input type="text" className="txtctrl" value={this.state.currentText} onChange={(e) => this.changeText(e)}></input>
                        </div>
                        <span>&nbsp;<br /></span>
                        <div className="row margin-0">
                            <div className="col s7" style={{ fontSize: "10pt", marginTop: "0.5%" }}>Font Size:</div>
                            <input type="text" className="col s3 offset-s2 txtfont"
                                value={this.state.currentFontSize} onChange={(e) => this.changeFontSize(e)}></input>
                        </div>
                        <span>&nbsp;<br /></span>
                        <div className="row margin-0">
                            <div className="col s9" style={{ fontSize: "10pt", marginTop: "2%" }}>Background:</div>
                            <label className="col s3 colorcircle" style={{ backgroundColor: this.state.currentBackColor }}>
                                <input type="color" className="colorpicker" onChange={(e) => this.changeBackColor(e)}></input>
                            </label>
                        </div>
                        <span>&nbsp;<br /></span>
                        <div className="row margin-0">
                            <div className="col s9" style={{ fontSize: "10pt", marginTop: "2%" }}>Text Color:</div>
                            <label className="col s3 colorcircle" style={{ backgroundColor: this.state.currentTextColor }}>
                                <input type="color" className="colorpicker" onChange={(e) => this.changeTextColor(e)}></input>
                            </label>
                        </div>
                        <span>&nbsp;<br /></span>
                        <div className="row margin-0">
                            <div className="col s9" style={{ fontSize: "10pt", marginTop: "2%" }}>Border Color:</div>
                            <label className="col s3 colorcircle" style={{ backgroundColor: this.state.currentBordColor }}>
                                <input type="color" className="colorpicker" onChange={(e) => this.changeBordColor(e)}></input>
                            </label>
                        </div>
                        <span>&nbsp;<br /></span>
                        <div className="row margin-0">
                            <div className="col s7" style={{ fontSize: "10pt", marginTop: "0.5%" }}>Border Thickness:</div>
                            <input type="text" className="col s3 offset-s2 txtfont"
                                value={this.state.currentBordThick} onChange={(e) => this.changeBordThick(e)}
                                style={{ marginTop: "4.4%" }}></input>
                        </div>
                        <span>&nbsp;<br /></span>
                        <div className="row margin-0">
                            <div className="col s7" style={{ fontSize: "10pt", marginTop: "0.5%" }}>Border Radius:</div>
                            <input type="text" className="col s3 offset-s2 txtfont"
                                value={this.state.currentBordRad} onChange={(e) => this.changeBordRad(e)}
                                style={{ marginTop: "4.4%" }}></input>
                        </div>
                        <span>&nbsp;<br /></span>
                        <div className="row margin-0" style={{ backgroundColor: "white" }}>
                            <span style={{ margin: "auto", display: "table" }}>Wireframe Dimensions</span>
                            <div className="row margin-0">
                                <div className="col s7" style={{ fontSize: "10pt", marginTop: "0.5%" }}>Width:</div>
                                <input type="text" className="col s3 offset-s2 txtfont"
                                    value={this.state.disWidth} onChange={(e) => this.changeWidth(e)}></input>
                            </div>
                            <div className="row margin-0">
                                <div className="col s7" style={{ fontSize: "10pt", marginTop: "0.5%" }}>Height:</div>
                                <input type="text" className="col s3 offset-s2 txtfont"
                                    value={this.state.disHeight} onChange={(e) => this.changeHeight(e)}></input>
                            </div>
                            <Button onClick={() => this.updateDims()} disabled={!this.state.updateDims}
                                style={{ backgroundColor: "#ae585e", margin: "auto", display: "table" }}>Update Dimensions
                            </Button>
                        </div>
                        <span style={{ fontSize: "11.7pt" }}>&nbsp;<br /></span>
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