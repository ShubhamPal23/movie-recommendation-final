import { createSlice } from '@reduxjs/toolkit';

const movieSlice = createSlice({
  name: 'movie',
  initialState: {
    movies: [],
    filteredMovies: [],
    isMoviesLoaded: false, 
  },
  reducers: {
    setMovies: (state, action) => {
      state.movies = action.payload;
      state.isMoviesLoaded = true; 
    },
    setFilteredMovies: (state, action) => {
      state.filteredMovies = action.payload;
    },
  },
});

export const { setMovies, setFilteredMovies } = movieSlice.actions;
export default movieSlice.reducer;
