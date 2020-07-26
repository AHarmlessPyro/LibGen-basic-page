import React from 'react'
import ButtonCustom from './button-standard'

class InfoCard extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let btnElement = []
        btnElement.push(
            <a href={`${this.props.URL}/book/index.php?md5=${this.props.obj.md5}`}>
                <ButtonCustom key={`${this.props.obj.md5}+download`} classes="primaryOppositeColor" onClickFunction={() => { window.location = `${this.props.URL}/book/index.php?md5=${this.props.obj.md5}` }}>
                    Download
                </ButtonCustom>
            </a>
        )
        if (this.props.addBtn) {
            btnElement.push(
                <ButtonCustom key={`${this.props.obj.md5}+add`} classes="primaryColor" onClickFunction={() => { this.props.addFunc(this.props.obj) }}>
                    +Add
            </ButtonCustom>)
        } else {
            btnElement.push(
                <ButtonCustom key={`${this.props.obj.md5}+remove`} classes="primaryColor" onClickFunction={() => { this.props.removeFunc(this.props.obj.md5) }}>
                    -Remove
            </ButtonCustom>)
        }
        return (
            <div
                className="infoCard border"
                key={this.props.obj.md5}>
                {/*Optionally add images. Image origins are resetricted, 
                so that's a moot point right now*/}
                {/* <img src={imgSrc}></img> */}
                <div title={this.props.obj.author || this.props.obj.publisher}>
                    <span >
                        {this.props.obj.author || this.props.obj.publisher}
                    </span>
                </div>
                <div title={this.props.obj.title}>
                    <span>
                        {this.props.obj.title}
                    </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", justifyItems: "center" }}>
                    {btnElement}
                </div>
            </div >
        )
    }
} export default InfoCard;