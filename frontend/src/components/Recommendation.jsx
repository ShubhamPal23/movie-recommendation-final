import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFilteredMovies } from "../store/movieSlice";
import { useNavigate } from "react-router-dom";
import "./Recommendation.css";

const Recommendation = () => {
  const dispatch = useDispatch();
  const { movies, filteredMovies } = useSelector((state) => state.movie);
  const [keyword, setKeyword] = useState("");
  const [sortByYear, setSortByYear] = useState(true);
  const navigate = useNavigate();

  const handleRecommend = () => {
    if (keyword.trim() === "") {
      dispatch(setFilteredMovies([]));
    } else {
      const keywordsArray = keyword.toLowerCase().split(" ");
      let results = movies.filter((movie) =>
        keywordsArray.some((kw) =>
          Object.values(movie).some((value) =>
            String(value).toLowerCase().includes(kw)
          )
        )
      );

      if (sortByYear) {
        results = results.sort((a, b) => {
          const yearA = parseInt(a.movieYear, 10) || 0;
          const yearB = parseInt(b.movieYear, 10) || 0;
          return yearB - yearA;
        });
      }

      dispatch(setFilteredMovies(results));
      navigate(`/recommendation?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <div id="recommendation">
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>
        Find Your Perfect Movie
      </h2>
      <input
        type="text"
        placeholder="Type a movie keyword..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="recommend-input"
      />
      <button onClick={handleRecommend} className="search-button">
        Recommend
      </button>
      <label>
        <input
          type="checkbox"
          checked={sortByYear}
          onChange={() => setSortByYear((prev) => !prev)}
        />
        Sort by Latest Year
      </label>
      <div>
      {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div key={movie.movieId} className="last-work">
              <div className="recom-img">
                <img
                  onClick={() => {
                    navigate(`/recommendation/${encodeURIComponent(movie.movieTitle)}`);
                  }}
                  src={movie.imageLink}
                  alt={movie.movieTitle}
                />
              </div>
              <div className="recom-details">
                <a
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                  onClick={() => {
                    navigate(`/recommendation/${encodeURIComponent(movie.movieTitle)}`);
                  }}
                >
                  <h3 style={{ color: 'black' }}>
                    <strong>{movie.movieTitle}</strong>
                  </h3>
                </a>
                <p style={{ color: 'black' }}>{movie.genres || 'N/A'}</p>
                <p className="recom-overview" style={{ color: 'black', marginTop: '20px', fontSize: '1rem' }}>
                  {movie.overview || 'N/A'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-recom" style={{ minHeight: '510px' }}>
            <p>No recommendations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendation;
