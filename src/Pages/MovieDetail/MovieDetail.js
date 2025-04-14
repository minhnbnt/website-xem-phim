import React, { useState, useEffect, useRef } from 'react'
import styles from './MovieDetail.module.css'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useNotification } from '../../context/NotificationContext/NotificationContext'
import TextOverflow from '../../components/TextOverflow/TextOverflow'
import Header from '../../components/Header/Header'
import SpecialVideo from '../../components/Video/SpecialVideo/SpecialVideo.js'
import Video from '../../components/Video/Video/Video.js'
import Image from '../../components/Image/Image.js'

const api_key = import.meta.env.VITE_APP_API_KEY;
const access_token = import.meta.env.VITE_APP_API_READ_ACCESS_TOKEN;
const image_base_url = import.meta.env.VITE_APP_TMDB_BASE_IMAGE_URL;
const tvshow_detail_api = 'https://api.themoviedb.org/3/tv/{series_id}'
const movie_detail_api = 'https://api.themoviedb.org/3/movie/{movie_id}'
const randomAvatarColor = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
    "#33FFF3", "#F3FF33", "#FF8C33", "#8C33FF", "#33FF8C",
    "#FF3333", "#33A1FF", "#A1FF33", "#FF338C", "#338CFF",
    "#FFC133", "#33FFC1", "#C133FF", "#33C1FF", "#FF33C1"
]

function MovieDetail() {
    const [movieData, setMovieData] = useState({
        movieDetail: null,
        movieVideos: null,
        movieReviews: null
    })
    const movieIframeBox = useRef(null)
    const { showNotification } = useNotification()
    const { type, typeDetail, movieId, videoKey } = useParams();
    const navigate = useNavigate()
    useEffect(() => {
        const fetchMovieDetail = async () => {
            const results = await Promise.allSettled([
                fetch(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=${api_key}`).then(res => res.json()),
                fetch(`https://api.themoviedb.org/3/${type}/${movieId}/videos?api_key=${api_key}`).then(res => res.json()),
                fetch(`https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${api_key}`).then(res => res.json())
            ])
            console.log('results: ', results);
            localStorage.setItem('movieVideos', JSON.stringify(results[1].value.results))
            setMovieData({ 
                movieDetail: results[0].value, 
                movieVideos: results[1].value.results,
                movieReviews: results[2].value.results
            })

            if (results[0].status === "rejected") {
                showNotification("error", "Getting a movie detail is errored!");
            }
            if (results[1].status === "rejected") {
                showNotification("error", "Getting movies is errored!");
            }
            if (results[2].status === "rejected") {
                showNotification("error", "Getting movie reviews is errored!");
            }
        } 
        fetchMovieDetail()
    }, [])

    useEffect(() => {
        //https://api.rophim.tv/v1/movie/filterV2?countries=&genres=&years=&type=&status=&versions=&rating=&networks=&productions=&sort=release_date&page=1&keyword=the%20gorge
        
        //https://www.rophim.tv/xem-phim/mufasa-vua-su-tu.o2HG68kO?_rsc=16qtr
        
        // fetch('https://www.rophim.tv/tim-kiem?q=the%20gorge')
    }, [])

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString("en-US", {
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour12: false,
        });
    }

    if (movieData.movieVideos !== null && movieData.movieVideos.length === 0) {
        return (
            <div className="text-white">Sorry!</div>
        )
    }

    return (
        <div className={styles.entireMovieDetail + " w-full h-auto flex gap-x-[15px] p-[5px]"}>
            <Header />
            <div 
                className={"w-[65%] h-auto mt-[50px] text-white transition-all duration-200 ease-linear bg-slate-800 flex flex-col justify-start items-start " + styles.movieIframeBox}
                ref={movieIframeBox} 
            >
                <div className={styles.movieImageBox + " w-full aspect-[16/9] mx-auto bg-black relative overflow-hidden rounded-[10px]"}>
                    {movieData.movieDetail ? (
                        <>
                            <Image 
                                src={`${image_base_url}original/${movieData.movieDetail.backdrop_path}`}
                            />
                            <div className={styles.movieOverviewBox + " absolute top-[60%] left-[8%] shadow-[0_0_3px_3px_black] bg-black/60 rounded-[8px] p-[5px]"}>
                                <h1 className="text-[120%]">
                                    {movieData.movieDetail.original_title || movieData.movieDetail.original_title}
                                </h1>
                                <div className="italic text-[92%] flex items-center">
                                    <p>{movieData.movieDetail.vote_average} ({movieData.movieDetail.vote_count})</p>
                                    <p className="text-[150%] text-center w-[5px] h-[5px] mx-[4px] rounded-[50%] bg-white"></p>
                                    <p>{movieData.movieDetail.media_type}</p>
                                    <p className="text-[150%] text-center w-[5px] h-[5px] mx-[4px] rounded-[50%] bg-white"></p>
                                    <p>{movieData.movieDetail.release_date}</p>
                                </div>
                                <div className="flex">
                                    <img src={`https://flagcdn.com/w40/${movieData.movieDetail.origin_country[0].toLowerCase()}.png`} alt="xxx" />
                                    <p className="ml-[5px]">{movieData.movieDetail.origin_country[0]}</p>
                                </div>
                                <div className="flex h-auto" title="Genres">
                                    {movieData.movieDetail.genres.map((genre, index) => (
                                        <>
                                            <p key={genre.id}>
                                                {genre.name}
                                            </p>
                                            {index < (movieData.movieDetail.genres.length - 1) ? (
                                                <div className="w-[2px] min-h-full bg-white mx-[5px]"></div>
                                            ) : ('')}
                                        </>
                                    ))}
                                </div>
                            </div>
                            
                        </>
                    ) : ('')}
                </div>
                {movieData.movieDetail ? (
                    <div className="p-[10px]">
                        <p><b>Overview:</b> {movieData.movieDetail.overview}</p>
                        <p><b>Budget: </b>{movieData.movieDetail.budget}</p>
                    </div>
                ) : ('')}
                <div className="w-[80%] h-[2px] bg-slate-300 mx-auto my-[8px] rounded-[10px]"></div>
                {movieData.movieReviews ? (
                    <div className="flex flex-col w-full">
                        <h1 className="text-[120%] ml-[10px]">Top reviews</h1>
                        {movieData.movieReviews.map((review, index) => (
                            <div key={`review${index}`} className="flex p-[10px]">
                                <div className={`rounded-[50%]  w-[40px] h-[40px] bg-[${randomAvatarColor[Math.floor(Math.random()*randomAvatarColor.length)]}] flex justify-center items-center mt-[5px]`}>
                                    {review.author_details.avatar_path ? (
                                        <img 
                                            src={`${image_base_url}original/${review.author_details.avatar_path}`}
                                            className="w-full h-full rounded-[50%]"
                                        />
                                    ) : (
                                        <p className="text-center">{review.author[0] || review.author_details[0]}</p>
                                    )}
                                </div>
                                <div className="w-[calc(100%-50px)] pl-[10px]">
                                    <h2 className="text-[120%] text-[grey]">{review.author}</h2>
                                    <TextOverflow content={review.content} useBy={"MovieDetail"}/>
                                </div>
                            </div>    
                        ))}
                    </div>
                ): ('')}
            </div>
            <div className={styles.trailersBox + " w-[32%] mt-[50px] h-screen flex flex-col gap-[5px]"}>
                <h1 className="text-white text-center text-[150%]">Related trailers</h1>
                {movieData.movieVideos === null ? (
                    ''
                ) : (
                    movieData.movieVideos.map((video) => (
                        <div 
                            className="w-full flex cursor-pointer hover:transform hover:scale-[1.03] transition-all duration-200 ease-linear" 
                            key={video.id}
                            onClick={() => navigate(`/watch/${video.key}`)}
                        >
                            <div className="w-[50%] aspect-[4/3]  relative border-[1px] border-solid border-white mr-[8px] rounded-[8px]">
                                <Image id={video.id} src={`https://img.youtube.com/vi/${video.key}/default.jpg`}/>
                                <div className={styles.playIcon + ' absolute top-[50%] left-[50%] hover:bg-slate-300'}></div>
                            </div>
                            <div className="w-[40%]">
                                <p className="text-white truncate">{video.name}</p>
                                <p className="text-[grey] truncate">{formatDate(video.published_at)}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default MovieDetail