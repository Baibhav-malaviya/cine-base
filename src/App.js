import { useEffect, useState } from "react";
import Rating from "./Rating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "b271788d";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("inception");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  useEffect(
    function () {
      async function fetchData() {
        try {
          setIsLoading(true);
          setError(""); //it is for reset the error to "" after getting some error message
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&S=${query}`
          );
          if (!res.ok)
            throw new Error(
              "Something went wrong with fetching the movies data"
            );
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          setIsLoading(false);
        } catch (err) {
          setError(err.message);
        }
      }
      if (query.length >= 3) fetchData();
    },
    [query]
  );

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <SearchResList movies={movies} />
      </Navbar>
      <Main>
        <Resultbox>
          {error ? (
            <ErrorMessage message={error} />
          ) : isLoading ? (
            <Loader />
          ) : (
            <MovieList
              movies={movies}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          )}
        </Resultbox>
        <Resultbox>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onHandleBack={handleCloseMovie}
              onHandleAddMovie={handleAddMovie}
              onHandleCloseMovie={handleCloseMovie}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <ul className="list">
                {watched.map((movie) => (
                  <WatchedList movie={movie} key={movie.imdbID} />
                ))}
              </ul>
            </>
          )}
        </Resultbox>
      </Main>
    </>
  );
}

function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Loader() {
  return <div className="loader">Loading...</div>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function MovieDetails({
  selectedId,
  onHandleBack,
  onHandleAddMovie,
  onHandleCloseMovie,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  console.log(userRating);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    Country: country,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      userRating: userRating,
    };
    onHandleAddMovie(newWatchedMovie);
    onHandleCloseMovie();
  }
  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  return isLoading ? (
    <Loader />
  ) : (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onHandleBack}>
          &larr;
        </button>
        <img src={poster} alt={`poster of ${title}`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime} ({country})
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>

      <section>
        <div className="rating">
          <Rating maxRating={10} size={24} onSetRating={setUserRating} />
          {userRating > 0 && (
            <button className="btn-add" onClick={handleAdd}>
              + add movie list
            </button>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function SearchResList({ movies }) {
  return (
    movies.length > 0 && (
      <p className="num-results">
        Found <strong>{movies.length}</strong> results
      </p>
    )
  );
}

// Navbar completed

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Resultbox({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieListItem({ movie, selectedId, setSelectedId }) {
  return (
    <li
      key={movie.imdbID}
      onClick={() =>
        setSelectedId(selectedId === movie.imdbID ? null : movie.imdbID)
      }
    >
      <img
        src={movie.Poster}
        alt={`${movie.Title.split(" ").join("").slice(0, 5)} poster`}
      />
      <h3>{movie.Title}</h3>
      <div>
        <IconInfo>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </IconInfo>
      </div>
    </li>
  );
}

function MovieList({ movies, selectedId, setSelectedId }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <MovieListItem
          movie={movie}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      ))}
    </ul>
  );
}

function WatchedList({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img
        src={movie.poster}
        alt={`${movie.title.split(" ").join("").slice(0, 5)} poster`}
      />
      <h3>{movie.title}</h3>
      <div>
        <IconInfo>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </IconInfo>
        <IconInfo>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </IconInfo>
        <IconInfo>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </IconInfo>
      </div>
    </li>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <IconInfo>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </IconInfo>
        <IconInfo>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </IconInfo>
        <IconInfo>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </IconInfo>
        <IconInfo>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </IconInfo>
      </div>
    </div>
  );
}

function IconInfo({ children }) {
  return <p>{children}</p>;
}
