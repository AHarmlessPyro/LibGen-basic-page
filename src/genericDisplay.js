import React from 'react';
import axios from 'axios';
import Spinner from './spinner.svg'
import ButtonCustom from './button-standard'

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
    let btnElement = []
    btnElement.push(
        <div>
            <a href={`${props.URL}/book/index.php?md5=${props.md5}`}>
                <ButtonCustom classes="primaryOppositeColor" onClickFunction={() => { window.location = `${props.URL}/book/index.php?md5=${props.md5}` }}>
                    Download
                </ButtonCustom>
            </a>
        </div>
    )
    if (props.addBtn) {
        btnElement.push(<div>
            <ButtonCustom classes="primaryColor" onClickFunction={() => { props.addFunc({ props }) }}>
                +Add
            </ButtonCustom>
        </div>)
    }
    // if (props.)
        return (
            <div
                className="infoCard border"
                key={props.md5}>
                {/*Optionally add images. Image origins are resetricted, 
                so that's a moot point right now*/}
                {/* <img src={imgSrc}></img> */}
                <div>{props.author}</div>
                <div>{props.title}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", justifyItems: "center" }}>
                    {btnElement}
                </div>
            </div >
        )
}

const SearchBar = (props) => {
    let options = props.options.map((value) => {
        return (<option value={value}>{value}</option>)
    })
    let select = <select className="border" name="search_opts" id="search_in">{options}</select>
    let searchBar = <input className="border" type="text" placeholder="Search Query Here" id="search_query"></input>
    let searchBtn = <ButtonCustom classes="primaryColor border" onClickFunction={() => { debugger; props.onClick(document.getElementById("search_in").value, document.getElementById("search_query").value) }}>Search</ButtonCustom>
    return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}>
        {select}{searchBar} {searchBtn}
    </div >
}


class GenericDisplay extends React.Component {
    constructor(props) {
        super(props);

        let splits = document.cookie.split(';');
        let userName;
        splits.forEach((value) => {
            if (value.includes('user')) {
                userName = value.slice('user='.length + 1);
            }
        })

        //localStorage.getItem(document.cookie)

        this.state = {
            URL: 'https://libgen.is',
            arrivalData: [],
            exploreData: [],
            genericDisplay: [],
            arrivalPagination: 1,
            searchQuery: "cats",
            search_in: "title",
            user: userName
        }
    }

    addBook(commitObj) {
        localStorage.setItem(commitObj.props.md5, JSON.stringify(commitObj.props.obj))
    }

    createCardElement(data, haveAddBtn = true) {
        let elementArray = data.map((value) => {
            let element = <Card
                key={value.md5}
                id={value.id}
                author={value.author || value.publisher}
                title={value.title}
                md5={value.md5}
                covers={value.coverurl}
                filesize={value.filesize}
                URL={this.state.URL}
                addBtn={haveAddBtn}
                addFunc={this.addBook}
                obj={value}>
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
                URL: result.data
            });
        })

        this.props.setRenderingStatus(true);
    }

    incrementPagination(data) {
        debugger;
        let lowerLimit = 20 * (this.state.arrivalPagination - 1);
        let upperLimit = 20 * (this.state.arrivalPagination);

        let maxPagination = Math.ceil(data.length / 20);

        upperLimit = upperLimit > this.state.arrivalData.length ?
            this.state.arrivalData.length : upperLimit;
        if (data.length === 0 || data == "") {
            this.setState({ genericDisplay: <div>No Results</div> });
            return;
        }
        let dataSrc = data.slice(lowerLimit, upperLimit)

        let paginationElement = [];


        // Previous Button. If current page < 1, don't let go back
        paginationElement.push(
            <ButtonCustom
                key="pagination-prev"
                classes="primaryColor maxSize"
                onClickFunction={() => {
                    debugger;
                    if (this.state.arrivalPagination > 1) {
                        this.setState({ arrivalPagination: this.state.arrivalPagination - 1 })
                        this.incrementPagination(this.state.arrivalData);
                    }
                }}>
                Previous
            </ButtonCustom>
        );
        // Next Button. If current page >maxPagination, don't let go forward
        paginationElement.push(
            <ButtonCustom
                key="pagination-next"
                classes="primaryColor maxSize"
                onClickFunction={() => {
                    debugger;
                    if (this.state.arrivalPagination < maxPagination) {
                        this.setState({ arrivalPagination: this.state.arrivalPagination + 1 })
                        this.incrementPagination(this.state.arrivalData);
                    }
                }}>
                Next
            </ButtonCustom >
        );

        let internalContent =
            <div style={{ display: "grid", gap: "5px" }}>
                <SearchBar options={["title", "author", "series", "periodical", "publisher", "year", "identifier",
                    "md5", "extension"]} onClick={(search_in, search_query) => {
                        this.setState({
                            searchQuery: search_query,
                            search_in: search_in
                        });
                        this.props.setRenderingStatus(true);
                    }}></SearchBar>
                <div style={{ display: "grid", gap: "50px" }}>
                    <div className="cardDisplay">
                        {this.createCardElement(dataSrc)}
                    </div>
                    {<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                        {paginationElement}
                    </div>}
                </div>
            </div>
        this.setState({
            genericDisplay: internalContent
            // exploreData: result.data
        });
    }

    componentDidUpdate() {
        if (this.props.rerender) {
            this.props.setRenderingStatus(false);
            this.setState({ genericDisplay: <Loader></Loader> });
            if (this.props.mode === 'Arrivals') {
                axios.get(`${baseURL}/arrivals/10`, {}, {
                    headers: {
                        "x-Trigger": "CORS"
                    }
                }).then((result) => {
                    let internalContent =
                        <div className="cardDisplay" >
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
                // Not really an ideal approach to pagination. Realistically,
                // should do this in steps of fetching 21 (so count = 21). Then
                // on load of next, do another 21 this step by step approach 
                // would probably lighten load and make it more efficient and
                // snappy. That said, time restrictions are a thing.

                // Number 200 was decided as it fits nicely with 11 or so (220
                // results) that libgen provides generally. 10 is a nice round
                // number that would probably fit most usecases. Even for a 
                // generic topic like cats, the non fiction results that this
                // focuses on produced 11 pages. Fiction did 38, but that is
                // not a topic of concern.

                axios.post(`${baseURL}/explore`, {
                    "query": this.state.searchQuery,
                    "search_in": this.state.search_in,
                    "sort_by": "title",
                    "count": "21"
                }, {
                    headers: {
                        "x-Trigger": "CORS"
                    }
                }).then((result) => {
                    debugger;
                    this.setState({ arrivalData: result.data });
                    this.incrementPagination(result.data);

                }).catch((error) => {
                    this.setState({ genericDisplay: <div>No Results, or error</div> });
                })
                this.props.setRenderingStatus(false);
                this.setState({ genericDisplay: <Loader></Loader> });
            } else if (this.props.mode === 'Collections') {
                let storedCards = [];
                for (let i in localStorage) {
                    try {
                        let data = JSON.parse(localStorage[i]);
                        if (data.md5 !== undefined) {
                            storedCards.push(data);
                        }
                    } catch{
                        // do nothing. Bad practice
                    }
                }
                let collectionsElement = <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}>
                    {this.createCardElement(storedCards, false)}
                </div>

                this.setState({ genericDisplay: collectionsElement })
            }
        }
    }
    render() {
        return (
            <div id="contentDisplay">
                {this.state.genericDisplay}
            </div>
        )
    }

} export default GenericDisplay;