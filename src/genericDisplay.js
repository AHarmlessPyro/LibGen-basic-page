import React from 'react';
import axios from 'axios';
import Spinner from './spinner.svg'

const arrivalsCount = 10;

const baseURL = 'https://libgenserver.herokuapp.com';

/* card contents
    author:
    title:
    md5:
    URL:
 */

const Loader = () => {
    return (<div
        style={{
            display: "grid",
            justifyContent: "center",
            alignContent: "center"
        }}>
        <img src={Spinner}>
        </img>
    </div>)
}

const Card = (props) => {
    // console.log(props);
    // let imgSrc = `${props.URL}/covers/${props.covers}` || Null;
    // can get image URL correctlly, but can't fetch as origin is forbidden
    return (
        <div
            className="infoCard"
            key={props.md5}>
            {/* <img src={imgSrc}></img> */}
            <div>{props.author}</div>
            <div>{props.title}</div>
            <div><a href={`${props.URL}/book/index.php?md5=${props.md5}`}>Download</a></div>
        </div>
    )
}

class GenericDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            URL: 'https://libgen.is',
            arrivals: {}
        }
    }

    createCardElement(data) {
        // debugger;
        let elementArray = data.map((value) => {
            let element = <Card
                key={value.md5}
                author={value.author || value.publisher}
                title={value.title}
                md5={value.md5}
                covers={value.coverurl}
                URL={this.state.URL}>
            </Card>
            return (element);
        })
        return elementArray;
    }

    componentDidMount() {
        axios.get(baseURL, {}, {
            headers: {
                "x-Trigger": "CORS"
            }
        }).then((result) => {
            this.setState({
                URL: result.data,
                arrivalDisplay: [],
                arrivalData: [],
                exploreDisplay: [],
                exploreData: [],
                genericDisplay: []
            });
        })

        this.props.setRenderingStatus(true);
    }

    componentDidUpdate() {
        if (this.props.rerender) {
            if (this.props.mode === 'Arrivals') {
                axios.get(`${baseURL}/arrivals/10`, {}, {
                    headers: {
                        "x-Trigger": "CORS"
                    }
                }).then((result) => {
                    let internalContent =
                        <div
                            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}
                        >
                            {this.createCardElement(result.data)}
                        </div>
                    this.setState({
                        genericDisplay: internalContent,
                        // arrivalData: result.data
                    });
                });
                this.props.setRenderingStatus(false);
                this.setState({ genericDisplay: <Loader></Loader> });
            } else if (this.props.mode === 'Explore') {
                axios.post(`${baseURL}/explore`, {
                    "query": "cats",
                    "sort_by": "year",
                    "count": "20"
                }, {
                    headers: {
                        "x-Trigger": "CORS"
                    }
                }).then((result) => {
                    console.log(result);
                    let internalContent =
                        <div
                            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}
                        >
                            {this.createCardElement(result.data)}
                        </div>

                    this.props.setRenderingStatus(false);
                    this.setState({
                        genericDisplay: internalContent,
                        // exploreData: result.data
                    });
                })
                this.props.setRenderingStatus(false);
                this.setState({ genericDisplay: <Loader></Loader> });
            } else if (this.props.mode === 'Collections') {
                this.props.setRenderingStatus(false);
                this.setState({ genericDisplay: <Loader></Loader> });
            }
        }
    }
    render() {
        console.log(this.props.mode);
        // if (this.props.mode === 'Collections') {
        // } else if (this.props.mode === 'Arrivals') {
        //     return (
        //         <div id={"contentDisplay"}>
        //             {this.state.arrivalDisplay}
        //         </div>
        //     )
        // } else if (this.props.mode === 'Explore') {
        //     return (
        //         <div id={"contentDisplay"}>
        //             {this.state.exploreDisplay}
        //         </div>
        //     )
        // }
        return (
            <div id="contentDisplay">
                {this.state.genericDisplay}
            </div>
        )
    }

} export default GenericDisplay;