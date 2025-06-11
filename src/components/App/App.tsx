import SearchBar from '../SearchBar/SearchBar';
import css from './App.module.css';
import fetchMovies from '../../services/movieService';
import toast, { Toaster } from 'react-hot-toast';
import type { Movie } from '../../types/movie.ts';
import { useState } from 'react';
import MovieGrid from '../MovieGrid/MovieGrid.tsx';
import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import MovieModal from '../MovieModal/MovieModal.tsx';

const notify = () => toast.error('No movies found for your request.');

export default function App() {
  const [films, setFilms] = useState<Movie[]>([]);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedFilm, setSelectedFilm] = useState<Movie | null>(null);

  const handleSearch = async (film: string): Promise<void> => {
    try {
      setIsError(false);
      setFilms([]);
      setIsLoader(true);
      const data = await fetchMovies(film);
      if (data.length === 0) {
        notify();
      } else {
        setFilms(data);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoader(false);
    }
  };

  const handleChoice = (film: Movie): void => {
    setSelectedFilm(film);
  };

  const handleClosing = (): void => {
    setSelectedFilm(null);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {isLoader && <Loader />}
      {isError && <ErrorMessage />}
      {films.length !== 0 && (
        <MovieGrid onSelect={handleChoice} movies={films} />
      )}
      {selectedFilm && (
        <MovieModal movie={selectedFilm} onClose={handleClosing} />
      )}
      <Toaster />
    </div>
  );
}
