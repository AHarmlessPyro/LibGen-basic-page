import React from 'react';
import Card from './infoCard'

class CardEX extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        debugger;
        let ratingsArray = [false, false, false, false, false, false];
        if (this.props.obj.hasOwnProperty('ratings')) {
            ratingsArray[this.props.obj.ratings] = true;
        } else {
            ratingsArray[0] = true;
        }

        let readArray = [false, false, false, false];
        if (this.props.obj.hasOwnProperty('tags')) {
            readArray[this.props.obj.tags] = true;
        } else {
            readArray[0] = true;
        }


        return (
            <div style={{ display: "grid", gap: "5px" }} className="border">
                <Card
                    key={this.props.obj.md5}
                    obj={this.props.obj}
                    addFunc={this.props.addFunc}
                    removeFunc={this.props.removeFunc}
                    URL={this.props.URL}
                    addBtn={this.props.addBtn}>
                </Card>
                <div style={{ display: "grid", gap: "5px", gridTemplateRow: "1fr 1fr" }}>
                    <div className="maxSize">
                        <select className="border maxSize" onChange={(evt) => { this.props.onRatingChange(evt, this.props.obj) }}>
                            <option disabled selected={ratingsArray[0]} value> -- select an option -- </option>
                            <option selected={ratingsArray[1]} key={this.props.obj.md5 + "Rating-1"} value={1}>1</option>
                            <option selected={ratingsArray[2]} key={this.props.obj.md5 + "Rating-2"} value={2}>2</option>
                            <option selected={ratingsArray[3]} key={this.props.obj.md5 + "Rating-3"} value={3}>3</option>
                            <option selected={ratingsArray[4]} key={this.props.obj.md5 + "Rating-4"} value={4}>4</option>
                            <option selected={ratingsArray[5]} key={this.props.obj.md5 + "Rating-5"} value={5}>5</option>
                        </select>
                    </div>
                    <div className="maxSize">
                        <select className="border maxSize" onChange={(evt) => { this.props.onReadChange(evt, this.props.obj) }}>
                            <option disabled selected={readArray[0]} value> -- select an option -- </option>
                            <option selected={readArray[1]} key={this.props.obj.md5 + "Read-New"} value={1}>New</option>
                            <option selected={readArray[2]} key={this.props.obj.md5 + "Read-Reading"} value={2}>Reading</option>
                            <option selected={readArray[3]} key={this.props.obj.md5 + "Read-Read"} value={3}>Read</option>
                        </select>
                    </div>
                </div>
            </div>
        )
    }
} export default CardEX;