import { useContext, useEffect, useRef, useState } from "react"
import styles from './Login.module.css'
import googleIcon from '../../assets/google.png'
import { Link, useNavigate } from "react-router-dom";
import SpinAnimation from '../../components/LoadingAnimation/SpinAnimation/SpinAnimation'
import { useNotification } from "../../context/NotificationContext/NotificationContext";
import InputBox from "../../components/InputBox/InputBox";

const website_base_url = import.meta.env.VITE_APP_WEBSITE_BASE_URL

function Login() {
    const emailInput = useRef(null)
    const emailLabel = useRef(null)
    const passwordInput = useRef(null)
    const passwordLabel = useRef(null)
    const formLoginBox = useRef(null)
    const typingText = useRef(null)
    const [loading, setLoading] = useState()
    const navigate = useNavigate()
    const { showNotification } = useNotification()
    let waveElement = null

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await fetch(`${website_base_url}identity/auth/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'email': emailInput.current ? emailInput.current.value : '',
                    'password': passwordInput.current ? passwordInput.current.value : ''
                })
            })
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message);
            }
            const data = await res.json();
            setLoading(false)
            if (data.result.authenticated) {
                localStorage.setItem('evdToken', JSON.stringify(data.result.token))
                showNotification('success', data.message)
                navigate("/home")
                setTimeout(() => {
                    navigate('/home')
                }, 1000)
            }
        } catch (err) {
            showNotification('error', err.message)
            setLoading(false)
        }
    }

    const addWaveAnimation = (e) => {
        if (!waveElement) {
            waveElement = document.createElement('div')
            waveElement.classList.add(styles.waveElement)
            document.body.appendChild(waveElement)
            waveElement.style.top = `${e.clientY}px`
            waveElement.style.left = `${e.clientX}px`
        } else {
            waveElement.style.top = `${e.clientY}px`
            waveElement.style.left = `${e.clientX}px`
        }
        setTimeout(() => {
            waveElement?.remove()
            waveElement = null
        }, 300)
    }

    useEffect(() => {
        const text = "Welcome to our website! Please login to continue... <3";
        let index = 0;
        const typeEffect = () => {
            if (!typingText.current)
                return

            typingText.current.innerHTML = text.slice(0, index) + `<span class='${styles.caretElement}'></span>`;
            index++;
            if (index <= text.length) {
                setTimeout(typeEffect, 70);
            } else {
                typingText.current.style.borderRight = "none";
            }
        }
        typeEffect();
    }, [])

    return (
        <div className={styles.entireLoginPage + " w-full h-screen flex justify-center items-center text-white"}>
            <div
                ref={formLoginBox}
                className={styles.formLoginBox + " w-auto h-auto bg-black/70 rounded-[10px] p-3 absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] border-[1px] border-solid border-white flex justify-center"}
                onClick={addWaveAnimation}
            >
                <div className="min-w-[300px] flex justify-center relative mt-[40px]">
                    <p className={styles.typingText + " max-w-[200px] h-auto text-center relative p-0"} ref={typingText}>
                    </p>

                </div>
                <form onSubmit={handleLogin} className="min-w-[250px] h-auto border-[1px] border-solid border-white rounded-[10px] p-[5px]">
                    <InputBox id="emailInput" type={"text"} label={"Nhập email:"} refName={emailInput} />
                    <InputBox id="passwordInput" type={"password"} label={"Nhập password:"} refName={passwordInput} />
                    <div className="mx-1 mt-[5px]">
                        <Link>Forgot password?</Link>
                    </div>

                    <div className="flex justify-between mx-1 mt-1">
                        <p>Don't have an account?</p>
                        <Link to="/signup/" className="text-white underline" >
                            Signup
                        </Link>
                    </div>
                    <button
                        type="submit"
                        className="globalButtonStyle w-full h-[30px] outline-none bg-blue-500 mt-[20px] flex justify-center items-center shadow-[2px_2px_2px_grey] relative"
                    >
                        {loading ? <SpinAnimation
                            onLoading={loading}
                            additionalStyles={{
                                width: '22px',
                                height: '22px',
                                border: '4px solid white',
                            }}
                        >
                        </SpinAnimation> : <p>Login</p>}
                    </button>
                    <div className="relative w-full h-[1px] bg-slate-500 mt-8">
                        <div className="block absolute left-[50%] top-[-13px] px-2 transform translate-x-[-50%] bg-black">Or</div>
                    </div>
                    <div className="flex mt-[25px] bg-white text-black cursor-pointer justify-center items-center pl-[8px] p-1">
                        <img src={googleIcon} className="w-[23px]" />
                        <p className="ml-[7px]">Login with Google</p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;