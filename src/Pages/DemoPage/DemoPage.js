import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/Header/Header";
import styles from './DemoPage.module.css';
import SpinAnimation from "../../components/LoadingAnimation/SpinAnimation/SpinAnimation";
import TextOverflow from "../../components/TextOverflow/TextOverflow";
import BookMarkIcon from "../../components/BookMarkIcon/BookMarkIcon.js";
import HeartIcon from "../../components/HeartIcon/HeartIcon.js";
import { useNotification } from "../../context/NotificationContext/NotificationContext.js";

const api_key = import.meta.env.VITE_APP_API_KEY;
const access_token = import.meta.env.VITE_APP_API_READ_ACCESS_TOKEN;

const tmdb_image_base_url = import.meta.env.VITE_APP_TMDB_BASE_IMAGE_URL;
const tmdb_base_url = import.meta.env.VITE_APP_TMDB_BASE_URL;

const trendingListAll = `${import.meta.env.VITE_APP_TMDB_BASE_URL}3/trending/all/{time_window}`;
const backgroundImageWidth = 58
const slideShowImageWidth = 120
const gapBetweenImages = 20

function DemoPage() {
    const [trendingList, setTrendingList] = useState([])
    const trendingListElements = useRef([])
    const trendingListOverviewElements = useRef([])
    const defaultTrendingElementPosition = useRef(4)
    const currentTrendingElementPosition = useRef(4)
    const backgroundImageBox = useRef(null)
    const trendingListOverviewContent = useRef(null)
    const { showNotification } = useNotification()

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${access_token}`
            }
        };

        fetch(`${tmdb_base_url}3/trending/all/day`, options)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setTrendingList(data.results)
            })
            .catch(err => alert(err));
    }, [])

    useEffect(() => {
        fetch('https://api.rophim.tv/v1/movie/filterV2?countries=&genres=QriAOn&years=&type=&status=&versions=&rating=&networks=&productions=&sort=updated_at&page=1')
            .then(res => res.json())
            .then(data => {
                // console.log(data.result.items);
                // console.log('images caknca: ', data.result.items[0].images.posters[1].path.split('/')[3])
                // setTrendingList(data.result.items)
            })
            .catch(err => alert(err));
    }, [])

    const handleTrendingListTransition = (index) => {
        backgroundImageBox.current.style.transform = `translateX(${-index * 100}%)`;

        trendingListOverviewElements.current[index].classList.remove(styles.trendingListOverviewContent)
        setTimeout(() => {
            trendingListOverviewElements.current[index].classList.add(styles.trendingListOverviewContent)
        }, 0)
        currentTrendingElementPosition.current = index
        let distance = index - defaultTrendingElementPosition.current

        trendingListElements.current.forEach((el, i) => {
            Object.assign(el.style, {
                margin: `${i === index ? "0 10px" : "0"}`,
                transition: "transform 0.4s linear",
                transform: `translateX(${-distance * slideShowImageWidth - gapBetweenImages * (distance - 1)}px) ${i === index ? "scale(1.3)" : ""}`,
                filter: i === index ? "brightness(1.5)" : "brightness(0.7)"
            });
        });
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center overflow-hidden relative">
            <Header
                onSearching={() => showNotification('error', 'Please login or signup!')}
                onReset={() => showNotification('error', 'Please login or signup!')}
                additionalHeaderStyles={{
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    top: "10px",
                    width: "98%",
                    borderRadius: "10px"
                }}
            ></Header>
            {
                (trendingList.length === 0) ? (
                    <div className="absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <SpinAnimation onLoading={true} style={{
                            width: '30px',
                            height: '30px',
                            border: '4px solid white',
                        }} />
                    </div>) : (
                    <div
                        ref={backgroundImageBox}
                        className={`w-[100%] h-[100%] flex flex-wrap flex-col relative transform translate-x-[${-currentTrendingElementPosition.current * 100}%]`}
                    >
                        {trendingList.map((ele, index) => (
                            <div key={ele.id} className="backgroundImage w-full h-full text-white overflow-hidden flex relative z-0">
                                <img
                                    src={`${tmdb_image_base_url}original/${ele.backdrop_path || ele.poster_path}`}
                                    className={`w-[${backgroundImageWidth}%] ml-[-${backgroundImageWidth * 2 - 100}%] transform scale-x-[-1]`}
                                    alt=""
                                />
                                <img
                                    src={`${tmdb_image_base_url}original/${ele.backdrop_path || ele.poster_path}`}
                                    className={`w-[${backgroundImageWidth}%]`}
                                    alt=""
                                />
                                <div
                                    className={styles.trendingListOverviewBox + ` absolute top-0 left-0 bottom-0 text-white w-[${backgroundImageWidth - (backgroundImageWidth * 2 - 100)}%] flex flex-col justify-center items-end`}
                                >
                                    <div
                                        ref={(el) => (trendingListOverviewElements.current[index] = el)}
                                        className={styles.trendingListOverviewContent + " p-0 w-auto h-auto absolute top-[80px] left-[60px]"}
                                    >
                                        <h1 className="text-[150%] font-bold p-0 ml-[20px] w-full h-auto">
                                            Trending movie
                                        </h1>
                                        <h1 className="text-[140%] font-bold p-0 w-full h-auto">
                                            {ele.title || ele.original_title || ele.name || ele.original_name}
                                        </h1>
                                        <div className="italic text-[92%] flex items-center">
                                            <p>{ele.vote_average} ({ele.vote_count})</p>
                                            <p className="text-[150%] text-center w-[5px] h-[5px] mx-[4px] rounded-[50%] bg-white"></p>
                                            <p>{ele.media_type}</p>
                                            <p className="text-[150%] text-center w-[5px] h-[5px] mx-[4px] rounded-[50%] bg-white"></p>
                                            <p>{ele.release_date}</p>
                                        </div>
                                        <TextOverflow content={ele.overview} />
                                        <div className="flex justify-between items-center relative p-[5px]">
                                            <div className="flex justify-center">
                                                <button className={"h-auto w-auto bg-[yellow] text-black p-[5px] p-[3px] rounded-[5px] hover:shadow-[2px_2px_2px_red]"} onClick={() => showNotification('error', 'Please login or signup!')}>
                                                    Watch now!
                                                </button>
                                            </div>
                                            <div className="flex justify-center" onClick={() => showNotification('error', 'Please login or signup!')}>
                                                <BookMarkIcon width="15px" height="15px" />
                                                <HeartIcon width="15px" height="15px" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
            {
                (trendingList.length === 0) ? (
                    '') : (
                    <div
                        className={styles.defaultTrendingBox + ` absolute h-[130px] bottom-[30px] left-0 right-0 px-[12px] flex gap-[${gapBetweenImages}px] items-center bg-transparent overflow-y-hidden overflow-x-scroll scroll-smooth`}
                    >
                        {trendingList.map((ele, index) => (
                            <div
                                ref={(el) => (trendingListElements.current[index] = el)}
                                key={index}
                                style={index === currentTrendingElementPosition.current ? {
                                    margin: "0 10px",
                                    transform: "scale(1.3)",
                                    filter: "brightness(1.5)",
                                } : {
                                    filter: "brightness(0.7)",
                                }}
                                className={`item${index} min-w-[${slideShowImageWidth}px] h-[70%] rounded-[10px] shadow-[5px_5px_10px_black] transition-all duration-[0.5s] ease-in-out cursor-pointer flex items-center`}
                                onClick={() => handleTrendingListTransition(index)}
                            >
                                <img
                                    src={`${tmdb_image_base_url}original/${ele.backdrop_path || ele.poster_path}`}
                                    className="w-auto h-full rounded-[10px]"
                                    alt=""
                                />
                            </div>
                        ))}

                    </div>
                )
            }
        </div >
    )
}

export default DemoPage;