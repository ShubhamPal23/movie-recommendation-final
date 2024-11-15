import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Recommendation from "./components/Recommendation";
import Genre from "./components/Genre";
import Trending from "./components/Trending";
import Search from "./components/Search";
import MovieDetail from "./components/MovieDetail";
import Graph from "./components/Graph";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMovies } from "./store/movieSlice";
import Papa from "papaparse";

function App() {
  const dispatch = useDispatch();
  const isMoviesLoaded = useSelector((state) => state.movie.isMoviesLoaded);

  useEffect(() => {
    if (!isMoviesLoaded) {
      const loadCSV = async (fileName) => {
        return new Promise((resolve, reject) => {
          Papa.parse(`/${fileName}`, {
            download: true,
            header: true,
            complete: (result) => resolve(result.data),
            error: (error) => reject(error),
          });
        });
      };

      const loadAllMovies = async () => {
        try {
          const movieData = await loadCSV("movies_with_image_links.csv");
          const reviewData = await loadCSV("generated_movie_reviews.csv");
          const movielink = await loadCSV("movies.csv");

          const movieMap = new Map();
          movieData.forEach((movie) => {
            movieMap.set(movie.movieId, { ...movie });
          });

          reviewData.forEach((review) => {
            const movieId = review.movieId;
            if (movieMap.has(movieId)) {
              movieMap.set(movieId, { ...movieMap.get(movieId), ...review });
            }
          });

          movielink.forEach((link) => {
            const movieId = link.movieId;
            if (movieMap.has(movieId)) {
              movieMap.set(movieId, { ...movieMap.get(movieId), ...link });
            }
          });

          dispatch(setMovies([...movieMap.values()]));
        } catch (error) {
          console.error("Error loading CSV files:", error);
        }
      };

      loadAllMovies();
    }
  }, [dispatch, isMoviesLoaded]);

  return (
    <div id="root">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/recommendation/:movieTitle" element={<MovieDetail />} />
          <Route path="/genre" element={<Genre />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/search" element={<Search />} />
          <Route path="/trending/graph" element={<Graph />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
