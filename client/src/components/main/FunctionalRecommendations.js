import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../ErrorNotice";
import RecommendationBook from "./RecommendationBook";
export default function FunctionalRecommendations(props) {
  const { userData } = useContext(UserContext);
  const [errorM, setError] = useState(undefined);
  const [recommendations, setRecommendations] = useState([]);
  //   useEffect(() => {
  //     makeRequest(userData.user.email);
  //   });
  useEffect(() => {
    makeRequest(userData.user.email);
  }, [userData.user.library, userData.user.wishlist, userData.user.email]);
  const makeRequest = async (email) => {
    try {
      let recommendationResult = await Axios.post(
        "/home/recommendations/getBooks",
        { email: email },
        {
          headers: { "Content-Type": "application/JSON" },
        }
      );
      const { books } = recommendationResult.data;
      setRecommendations(books);
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  return (
    <div className="recommendation-container">
      {errorM && (
        <ErrorNotice message={errorM} clearError={() => setError(undefined)} />
      )}
      <div className="books-container bg-light">
        {typeof recommendations != "undefined" ? (
          recommendations.map((book, index) => {
            return (
              <div key={index}>
                <RecommendationBook book={book} />
              </div>
            );
          })
        ) : (
          <h3>Add books to your library or wishlist for recommendations</h3>
        )}
      </div>
    </div>
  );
}
