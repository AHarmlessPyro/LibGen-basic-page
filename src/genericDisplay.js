import React from 'react';
import axios from 'axios';
import Spinner from './spinner.svg'
import ButtonCustom from './button-standard'
import Card from './infoCard'
import CardEx from './infoCardExtended'

const arrivalsCount = 10;

const baseURL = 'https://libgenserver.herokuapp.com';

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

const SearchBar = (props) => {
    let options = props.options.map((value) => {
        return (<option key={value + "Search"} value={value}>{value}</option>)
    })
    let select = <select className="border" name="search_opts" id="search_in">{options}</select>
    let searchBar = <input className="border" type="text" placeholder="Search Query Here" id="search_query"></input>
    let searchBtn = <ButtonCustom classes="primaryColor border" onClickFunction={() => { props.onClick(document.getElementById("search_in").value, document.getElementById("search_query").value) }}>Search</ButtonCustom>
    return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}>
        {select}{searchBar} {searchBtn}
    </div >
}

const SortBar = (props) => {
    let options = props.options.map((value) => {
        return (<option key={value + "Sort"} value={value}>{value}</option>)
    });
    let select = <select className="border" name="sort_opts" id="sort_in" onChange={() => { props.sort(document.getElementById("sort_in").value) }}>
        <option disabled selected value> -- select an option -- </option>
        {options}
    </select >
    let reverseCheck = <input type="checkbox" classes="primaryColor border" id="reverseCheck" onChange={() => { props.sort(document.getElementById("sort_in").value, document.getElementById("reverseCheck").value) }}></input>
    let label = <label htmlFor="reverseCheck">Reverse</label>
    return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
        {select}<div>{reverseCheck}{label}</div>
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
        });

        this.state = {
            URL: 'https://libgen.is',
            arrivalData: [],
            exploreData: [],
            collectionsData: [],
            collectionsDataTemp: [],
            genericDisplay: [],
            arrivalPagination: 1,
            searchQuery: "cats",
            search_in: "title",
            user: userName
        }
    }

    addBook(commitObj) {
        let userStorage = localStorage.getItem(this.state.user);
        if (userStorage !== null) {
            userStorage = JSON.parse(userStorage);
        } else {
            userStorage = {};
        }
        userStorage[commitObj.md5] = commitObj;
        localStorage.setItem(this.state.user, JSON.stringify(userStorage));
    }

    getBook(md5 = undefined) {
        let userStorage = localStorage.getItem(this.state.user);
        if (userStorage !== null) {
            userStorage = JSON.parse(userStorage);
        } else {
            return {};
        }
        if (md5 === undefined) {
            return userStorage;
        } return userStorage[md5];
    }

    updateBook(md5, fieldToUpdate, value) {
        let dataSource = this.getBook(); //Not getting individual book as entire localstorage item would have to be updated
        dataSource[md5][fieldToUpdate] = value;
        localStorage.setItem(this.state.user, dataSource);
    }

    removeBook(md5) {
        let userStorage = this.getBook(undefined);
        delete userStorage[md5];
        localStorage.setItem(this.state.user, JSON.stringify(userStorage));
        //this.forceUpdate(); // use because data is updated, but no internal react value gets updated
        this.props.setRenderingStatus(true);
    }

    createCardElement(data, haveAddBtn = true) {
        let elementArray = data.map((value) => {
            let element = <Card
                URL={this.state.URL}
                addBtn={haveAddBtn}
                addFunc={this.addBook.bind(this)}
                removeFunc={this.removeBook.bind(this)}
                obj={value}>
            </Card>
            return (element);
        })
        return elementArray;
    }

    createExtendedCardElement(data, onRatingChange, onReadChange) {
        let elementArray = data.map((value) => {
            debugger;
            if (!value.hasOwnProperty('ratings') || !value.ratings) {
                Object.defineProperty(value, 'ratings', {
                    value: 0,
                    writable: true
                })
            }
            if (!value.hasOwnProperty('tags') || !value.tags) {
                Object.defineProperty(value, 'tags', {
                    value: 0,
                    writable: true
                })
            }
            let element = <CardEx
                URL={this.state.URL}
                addBtn={false}
                addFunc={this.addBook.bind(this)}
                removeFunc={this.removeBook.bind(this)}
                onRatingChange={(evt, item) => {
                    let currentBook = this.state.collectionsDataTemp[item.md5];
                    currentBook.ratings = evt.target.value;
                    this.addBook(currentBook);
                }}
                onReadChange={(evt, item) => {
                    let currentBook = this.state.collectionsDataTemp[item.md5];
                    currentBook.tags = evt.target.value;
                    this.addBook(currentBook);
                }}
                obj={value}>
            </CardEx>
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
                <SearchBar
                    options={["title", "author", "series", "periodical",
                        "publisher", "year", "identifier", "md5", "extension"]}
                    onClick={(search_in, search_query) => {
                        this.setState({
                            searchQuery: search_query,
                            search_in: search_in
                        });
                        this.props.setRenderingStatus(true);
                    }}>
                </SearchBar>
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
                    "count": "200"
                }, {
                    headers: {
                        "x-Trigger": "CORS"
                    }
                }).then((result) => {
                    this.setState({ arrivalData: result.data });
                    this.incrementPagination(result.data);

                }).catch((error) => {
                    this.setState({ genericDisplay: <div>No Results, or error</div> });
                })
                this.props.setRenderingStatus(false);
                this.setState({ genericDisplay: <Loader></Loader> });
            } else if (this.props.mode === 'Collections') {
                let storedCards = [];
                try {
                    let data = this.getBook(undefined);
                    if (data === {}) {
                        throw new Error('Illegal Object');
                    }
                    storedCards = Object.values(data);

                    this.setState({
                        collectionsData: storedCards,
                        collectionsDataTemp: storedCards
                    });

                } catch{
                    this.setState({
                        collectionsData: {},
                        collectionsDataTemp: {}
                    })
                }
            }
        }
    }

    render() {

        if (this.props.mode === 'Arrivals') {
        }
        else if (this.props.mode === 'Explore') { }
        else if (this.props.mode === 'Collections') {
            // sort of a special case. Since most other values were async, they
            // could be handled inside a promise. Since Collections is completely
            // synchronous, the logic is being a bit screwy.
            let pageInternalContent;
            if (this.state.collectionsDataTemp === {} || this.state.collectionsDataTemp === undefined || this.state.collectionsDataTemp.length === 0) {
                pageInternalContent = <div>No Results</div>
            } else {
                pageInternalContent =
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}>
                        {this.createExtendedCardElement(this.state.collectionsDataTemp, false)}
                    </div>
            }

            return (
                <div style={{ display: "grid", gap: "5px" }}>
                    <SearchBar options={["title", "author"]} onClick={(search_in, search_query) => {
                        let books = this.state.collectionsData;
                        let retVal = Object.values(books).filter((book) => {
                            if (book[search_in].includes(search_query)) {
                                return book;
                            }
                        });

                        this.setState({ collectionsDataTemp: retVal });
                    }}></SearchBar >
                    <SortBar options={["title", "author", "filesize", "ratings", "tags"]} sort={(key, reverse = false) => {
                        let tempStorage = [...this.state.collectionsDataTemp]
                        let store = tempStorage.sort((a, b) => {
                            // sort is longer than usual as it is a purely word based sort,i.e.
                            // it doesn't care about the length, similar to how normal sorting
                            // is expected to be. Basic sort first considers length of string,
                            // something not obvious.
                            if (a[key] === undefined) {
                                if (b[key] === undefined) {
                                    return 0;
                                }
                                return -1;
                            } if (b[key] === undefined) {
                                return 1;
                            }
                            if (!reverse) {
                                let aArr = `${a[key]} `;
                                let bArr = `${b[key]} `;
                                for (let i = 0; i < Math.min(aArr.length, bArr.length); i++) {
                                    let charAtA = aArr.charAt(i);
                                    let charAtB = bArr.charAt(i);
                                    if (charAtA < charAtB) {
                                        return -1;
                                    } else if (charAtA > charAtB) {
                                        return 1
                                    }
                                } return (aArr.length - bArr.length)
                            } else {
                                let aArr = `${a[key]} `;
                                let bArr = `${b[key]} `;
                                for (let i = 0; i < Math.min(aArr.length, bArr.length); i++) {
                                    let charAtA = aArr.charAt(i);
                                    let charAtB = bArr.charAt(i);
                                    if (charAtA < charAtB) {
                                        return 1;
                                    } else if (charAtA > charAtB) {
                                        return -1
                                    }
                                } return (bArr.length - aArr.length)
                            }
                        })
                        this.setState({ collectionsDataTemp: store });
                    }}></SortBar>
                    {pageInternalContent}
                </div >
            )

        }
        return (
            <div id="contentDisplay">
                {this.state.genericDisplay}
            </div>
        )
    }
} export default GenericDisplay;