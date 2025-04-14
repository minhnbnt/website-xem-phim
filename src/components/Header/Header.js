import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react'
import '../../index.css';
import decodeJWT from '../../utils/decodeJWT';
import styles from './Header.module.css';
import logo from '../../assets/Logo.png';

function Header({ onSearching, onReset, additionalHeaderStyles }) {
    const navigate = useNavigate()
    let searchInput = useRef(null)
    let searchField = useRef(null)
    let searchLabel = useRef(null)
    let searchImg = useRef(null)
    let header = useRef(null)
    const [avatar, setAvatar] = useState(null)
    const jwtToken = JSON.parse(sessionStorage.getItem('evdToken'))
    const decodedToken = jwtToken ? decodeJWT(jwtToken) : null
    const animateOnFocus = () => {
        console.log('on focus');
        searchLabel.current.style = 'display: none;'
        searchField.current.style = 'width: 20%;'
    }
    const animateOnBlur = () => {
        if (searchInput.current.value === '') {
            console.log('on blur');
            searchField.current.style = 'width: 10%;'
            searchLabel.current.style = 'display: inline-block;'
        }
    }
    const handleLogout = async () => {
        const res = await fetch(`${import.meta.env.VITE_APP_WEBSITE_BASE_URL}identity/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'token': `${jwtToken}`
            })
        })
        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.message)
        }
        sessionStorage.removeItem('evdToken')
        sessionStorage.removeItem('evdUserInfo')
        navigate('/')
    }
    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_APP_WEBSITE_BASE_URL}identity/api/users/${decodedToken.userId}/get-avatar`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                })

                if (!res.ok) {
                    const errorData = await res.json()
                    throw new Error(errorData.message)
                }

                const data = await res.json()
                setAvatar(data.result)
            } catch (err) {
                alert(err)
            }
        }
        if (jwtToken) {
            fetchAvatar()
        }
    }, [])
    return (
        <header
            style={additionalHeaderStyles}
            className="w-full h-[50px] bg-black flex justify-between items-center fixed top-0 left-0 right-0 z-20"
            ref={header}
        >
            <div className="w-1/2 flex justify-evenly items-center text-white">
                <img src={logo} className="w-[32px] h-[32px] rounded-[10px]" />
                <Link to="/home" className="hover:text-red-500 hover:shadow-[2px_2px_2px_black]">Home</Link>
                <button className="hover:text-red-500 hover:shadow-[2px_2px_2px_black]">Movies</button>
                <button className="hover:text-red-500 hover:shadow-[2px_2px_2px_black]">TV show</button>
            </div>

            <div ref={searchField} className="search-field w-[12%] h-[35px] p-2 py-4 text-white flex justify-center items-center border border-solid border-white rounded-[5px] relative transition-all duration-200 ease-linear">
                <input
                    id="search-input"
                    type="search"
                    ref={searchInput}
                    style={additionalHeaderStyles ? {
                        backgroundColor: "transparent",
                        borderBottom: "1px solid white"
                    } : {}}
                    className="w-[85%] text-white bg-black border-none outline-none cursor-pointer"
                    onFocus={animateOnFocus}
                    onBlur={(e) => {
                        if (e.target.value === '') {
                            onReset()
                            animateOnBlur()
                        } else {
                            onSearching(e.target.value)
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter')
                            onSearching(searchInput.current.value)
                    }}
                />
                <label ref={searchLabel} htmlFor="search-input" className="absolute left-[7px]">Search...</label>
                <label htmlFor="search-input" className="w-[18px] ml-[5px] cursor-pointer">
                    <img
                        ref={searchImg}
                        src="https://img.icons8.com/dusk/64/search--v1.png"
                        alt="search--v1"
                        onClick={() => onSearching(searchInput.current.value)}
                    />
                </label>
            </div>
            {jwtToken ? <div className={"w-auto h-full mr-[30px] flex justify-center items-center text-white relative  " + styles.userAvatar}>
                {avatar ? <img width="30" height="30"
                    src={`data:image/png;base64,${avatar}`} className="rounded-[50%]"
                /> : <img width="30" height="30" src="https://img.icons8.com/material/30/person-male.png" alt="person-male" className="rounded-[50%] bg-white" />
                }
                <p className="ml-[5px]">{decodedToken.sub}</p>
                <div className={styles.detailUserAvatar + " hidden w-[180px] h-auto p-2 flex flex-col items-start bg-white text-black rounded-[10px] absolute top-[100%] right-[-20px] hover:block border border-[2px] border-solid border-slate-500"}>
                    <p className='hover:bg-[#0C8CE9] px-1 w-full text-left'>Username: {decodedToken.sub}</p>
                    <Link to="/myinfo" className='hover:bg-[#0C8CE9] px-1 w-full text-left'>Account detail</Link>
                    <button className='hover:bg-[#0C8CE9] px-1 w-full text-left' onClick={handleLogout}>Log out</button>
                </div>
            </div> : <div className="w-1/5 mr-[0] flex justify-center items-center text-white">
                <Link to="/login" className="hover:text-red-500">Login</Link>
                <Link to="/signup" className="ml-[10px] hover:text-red-500">Signup</Link>
            </div>
            }
        </header>
    )
}

export default Header;
