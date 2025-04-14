import { useRef, useEffect, useState } from "react";
import React from "react";
import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import SideBar from "../../components/SideBar/SideBar.js";
import PulseAnimation from "../../components/LoadingAnimation/PulseAnimation/PulseAnimation.js";
import {
  fetchApiWithOptions,
  fetchApiWithParams,
} from "../../services/api_service/FetchMoviesApi.js";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext/NotificationContext.js";
import SpecialMovie from "../../components/SpecialMovie/SpecialMovie.js";
import Movie from "../../components/Movie/Movie.js";
import { sideBarMenu, cinemaMap } from "../../constants/menu.js";
import { urlTemplates } from "../../constants/TmdbUrls.js";

const api_key = import.meta.env.VITE_APP_API_KEY;
const access_token = import.meta.env.VITE_APP_API_READ_ACCESS_TOKEN;

const image_base_url = import.meta.env.VITE_APP_TMDB_BASE_IMAGE_URL;
const tmdb_base_url = import.meta.env.VITE_APP_TMDB_BASE_URL;
const videos_api = `${tmdb_base_url}3/movie/{movie_id}/videos`;
const popular_movies_api = `${tmdb_base_url}3/movie/popular`;
const now_playing_movies_api = `${tmdb_base_url}3/movie/now_playing`;
const top_rated_movies_api = `${tmdb_base_url}3/movie/top_rated`;
const upcoming_movies_api = `https://api.themoviedb.org/3/movie/upcoming`;
const movie_detail_api = `${tmdb_base_url}3/movie/{movie_id}`;
const movie_image_api = `${tmdb_base_url}3/movie/{movie_id}/images`;
const movie_review_api = `${tmdb_base_url}3/movie/{movie_id}/reviews`;
const movie_providers_api = `${tmdb_base_url}3/movie/{movie_id}/watch/providers`;

function Home() {
  const [movies, setMovies] = useState();
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [menuState, setMenuState] = useState({
    activeMenu: sideBarMenu[0],
    cinemaType: cinemaMap[sideBarMenu[0]][0],
  });
  console.log("menuState.cinemaType = ", menuState.cinemaType);
  const movieListBox = useRef(null);
  const { showNotification } = useNotification();
  let initialMovie = useRef(null);
  const handleActiveMenuUpdate = (newActiveMenu) => {
    setMenuState({
      activeMenu: newActiveMenu,
      cinemaType: cinemaMap[newActiveMenu] ? cinemaMap[newActiveMenu][0] : null,
    });
  };
  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      try {
        const params = {
          api_key: api_key,
          page: pageNumber,
        };
        const url = urlTemplates[menuState.activeMenu][menuState.cinemaType];
        const data = await fetchApiWithParams(url, params);
        data.type = menuState.activeMenu;
        initialMovie.current = data;
        setMovies(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        showNotification("error", err.message);
      }
    };
    if (menuState.activeMenu && menuState.cinemaType) fetchApi();
  }, [menuState, pageNumber]);

  const handleLoading = () => {
    setLoading(true);
  };

  const handleSearching = (searchValue) => {
    if (searchValue === "") return;
    setLoading(true);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    };

    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${searchValue}&include_adult=false&language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((data) => {
        data.type = menuState.activeMenu;
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const resetMovies = () => {
    console.log("initialMovie.current = ", initialMovie.current);
    console.log("onblur ......");
    setMovies(initialMovie.current);
  };

  const nextPage = (pageNumber) => {
    setPageNumber((prev) => prev + 1);
    setLoading(true);
  };
  const previousPage = (pageNumber) => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
      setLoading(true);
    }
  };

  return (
    <>
      <Header onSearching={handleSearching} onReset={resetMovies} />
      <div className="body flex relative mt-[50px] h-auto z-10">
        <SideBar onActiveMenuUpdate={handleActiveMenuUpdate} />

        <div
          className="movie-list-box flex flex-wrap gap-x-[8px] gap-y-[12px] w-[100%] sm:w-[80%] min-h-screen absolute top-0 right-0 rounded-[10px] box-border bg-black text-white transition-all duration-400 ease-linear"
          ref={movieListBox}
        >
          <div className="menuOnMobile absolute top-0 left-0 text-white w-[20px] h-[20px] text-center block sm:hidden">
            X
          </div>
          <div className="w-full h-[300px] bg-slate-800 rounded-[10px]">
            {!movies ? (
              ""
            ) : (
              <SpecialMovie
                id={"movie0"}
                movieImageUrl={`${image_base_url}/original/${movies.results[0].backdrop_path}`}
                movieData={movies.results[0]}
                type={movies.type.toLowerCase()}
                typeDetail={
                  menuState.cinemaType ? menuState.cinemaType.toLowerCase() : ""
                }
              />
            )}
          </div>

          {cinemaMap[menuState.activeMenu] ? (
            <div className="w-full h-auto flex justify-end p-0">
              <select
                id="movieTypeSelection"
                value={menuState.cinemaType}
                onChange={(e) =>
                  setMenuState((prev) => ({
                    activeMenu: prev.activeMenu,
                    cinemaType: e.target.value,
                  }))
                }
                className="w-[100px] text-white bg-black cursor-pointer border-[1px] border-solid border-[white] rounded-[4px]"
              >
                {cinemaMap[menuState.activeMenu].map((type, index) => (
                  <option
                    key={type}
                    value={type}
                    className="rounded-[10px] cursor-pointer"
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            ""
          )}

          {!movies
            ? ""
            : movies.results
                .slice(1)
                .map((data, index) => (
                  <Movie
                    id={`movie${index + 1}`}
                    movieImageUrl={`${image_base_url}/original/${data.poster_path}`}
                    movieData={data}
                    type={movies.type.toLowerCase().split(" ")[0]}
                    typeDetail={
                      menuState.cinemaType
                        ? menuState.cinemaType.toLowerCase()
                        : ""
                    }
                  />
                ))}
          <div className="page-transition w-full h-[30px] flex justify-center">
            <button
              title="Previous Page"
              className="w-[30px] bg-orange-500 hover:transform hover:scale-[1.1]"
              onClick={() => previousPage(pageNumber)}
            >
              {"<<"}
            </button>
            <p className="w-[30px] text-center">{pageNumber}</p>
            <button
              title="Next Page"
              className="w-[30px] bg-orange-500 hover:transform hover:scale-[1.1]"
              onClick={() => nextPage(pageNumber)}
            >
              {">>"}
            </button>
          </div>
        </div>
        <PulseAnimation onLoading={loading} />
      </div>
    </>
  );
}

export default Home;

{
  /* <iframe width="560" height="315" src="https://www.youtube.com/embed/gGmaZCZz48g?si=cDLDTXRavMIN83RE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */
}

//https://api.rophim.tv/v1/movie/casts/yydqspwR

//https://api.rophim.tv/v1/movie/filterV2?countries=&genres=QriAOn&years=&type=&status=&versions=&rating=&networks=&productions=&sort=updated_at&page=1

//https://api.rophim.tv/v1/movie/filterV2?page=1

//https://static.nutscdn.com/vimg/300-0/371719b10c674ec7230ed1583c1c452f.jpg
