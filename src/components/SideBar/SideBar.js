import { useRef, useEffect, useState, memo } from "react"
import { useNotification } from "../../context/NotificationContext/NotificationContext"
import styles from './SideBar.module.css'
import { sideBarMenu, trendingMenu, movieMenu, tvshowMenu, cinemaMap, linkIcon } from '../../constants/menu'

//https://api.themoviedb.org/3/trending/person/{time_window}
//https://api.themoviedb.org/3/trending/tv/{time_window}
const access_token = import.meta.env.VITE_APP_API_READ_ACCESS_TOKEN
const api_key = import.meta.env.VITE_APP_API_KEY
const image_base_url = import.meta.env.VITE_APP_TMDB_BASE_IMAGE_URL;

function SideBar({ onActiveMenuUpdate }) {
    const [activeMenu, setActiveMenu] = useState(sideBarMenu[0])
    const [trendingPeople, setTredingPeople] = useState([])
    const { showNotification } = useNotification()
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/trending/person/day?api_key=${api_key}`)
            .then(res => res.json())
            .then(data => {
                setTredingPeople(data.results)
            })
            .catch(err => showNotification('error', err.message))
    }, [])

    return (
        <div className={styles.sideBar + " sideBar w-[20%] h-[100%] text-white bg-black fixed top-[50px] left-[-40%] sm:left-0 transition-all duration-400 ease-linear z-50 flex flex-col"}>
            {sideBarMenu.map((tab, index) => (
                <div
                    key={tab}
                    onClick={() => {
                        setActiveMenu(tab)
                        onActiveMenuUpdate(tab)
                    }}
                    className="cursor-pointer flex items-center p-[8px] mr-[10px]"
                    style={tab === activeMenu ? {

                    } : {
                        opacity: "0.8"
                    }}
                >
                    <img
                        className="w-[24px] h-[24px] mx-[10px]"
                        src={linkIcon[tab]}
                        alt={tab}
                    />
                    <p>
                        {tab}
                    </p>
                </div>
            ))}
            <div className={"absolute w-full h-[40px] border-[1px] border-solid bg-[red] right-[15px] left-0 rounded-[8px] transition-all duration-500 cursor-pointer flex items-center " + `top-[${sideBarMenu.indexOf(activeMenu) * 40}px]`}>
                <img
                    className="w-[24px] h-[24px] mx-[15px]"
                    src={linkIcon[activeMenu]}
                    alt={activeMenu}
                />
                <p>
                    {activeMenu}
                </p>
            </div>
            <div className="w-[80%] h-[8px] bg-slate-400 mx-auto mt-[10px]"></div>
            {trendingPeople ? (
                <div className="globalScrollStyle w-full overflow-scroll mt-[10px]">
                    <h1 className="font-medium text-center">Trending people</h1>
                    {trendingPeople.map((person, index) => (
                        <div key={`person${index}`} className="flex w-full h-auto justify-start items-center my-[6px]">
                            <img
                                src={`${image_base_url}original/${person.profile_path}`}
                                alt=""
                                className="min-w-[40px] h-[40px] rounded-[50%] mx-[5px]"
                            />
                            <p>{person.name || person.original_name}</p>
                        </div>
                    ))}
                </div>
            ) : ('')}
        </div>
    )
}

export default memo(SideBar);