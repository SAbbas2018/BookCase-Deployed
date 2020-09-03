import React, { Component } from "react";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../ErrorNotice";
import RecommendationBook from "./RecommendationBook";
export default class Recommendation extends Component {
  static contextType = UserContext;
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      errorM: "",
      recommendation: [],
      userEmail: "",
      update: false,
    };
    this.setError = this.setError.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  makeRequest(email) {
    const getRecom = async () => {
      try {
        let recommendationsRes = await Axios.post(
          "/home/recommendations/getBooks",
          { email: email },
          {
            headers: { "Content-Type": "application/JSON" },
          }
        );
        const { books } = recommendationsRes.data;
        if (this._isMounted) {
          this.setState((prevState) => {
            return {
              ...prevState,
              recommendation: books,
              update: false,
            };
          });
        }
      } catch (err) {
        this.setError(err.message);
        console.log(err);
      }
    };
    getRecom();
  }
  // componentDidUpdate() {
  //   if (this.state.update === true) {
  //     this.makeRequest(this.state.userEmail);
  //   }
  // }
  static getDerivedStateFromProps(props, state) {
    // this.makeRequest(this.state.userEmail);
    return { update: true };
  }
  componentDidMount() {
    this._isMounted = true;
    console.log(this.props);
    const { userData } = this.context;
    this.setState((prevState) => {
      return {
        ...prevState,
        userEmail: userData.user.email,
      };
    });
    this.makeRequest(userData.user.email);
  }
  setError(e) {
    this.setState((prevState) => {
      return {
        ...prevState,
        errorM: e,
      };
    });
  }
  render() {
    return (
      <div className="recommendation-container">
        {this.state.errorM && (
          <ErrorNotice
            message={this.state.errorM}
            clearError={() => this.setError(undefined)}
          />
        )}
        <div className="books-container bg-light">
          {typeof this.state.recommendation != "undefined"
            ? this.state.recommendation.map((book, index) => {
                return (
                  <div key={index}>
                    <RecommendationBook book={book} />
                  </div>
                );
              })
            : null}
        </div>
      </div>
    );
  }
}
