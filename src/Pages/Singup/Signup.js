import { useRef, useEffect } from "react";
import styles from './Signup.module.css';
import facebookIcon from '../../assets/facebook.png'
import googleIcon from '../../assets/google.png'
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext/NotificationContext";
import InputBox from "../../components/InputBox/InputBox";

const website_base_url = import.meta.env.VITE_APP_WEBSITE_BASE_URL

function Signup() {
    const usernameInput = useRef(null);
    const usernameLabel = useRef(null);
    const emailInput = useRef(null);
    const emailLabel = useRef(null);
    const passwordInput = useRef(null);
    const passwordLabel = useRef(null);
    const confirmPasswordInput = useRef(null);
    const confirmPasswordLabel = useRef(null);
    const typingText = useRef(null)
    const { showNotification } = useNotification()
    const navigate = useNavigate()

    let waveElement = null

    const handlerSignup = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`http://localhost:8080/identity/users/signup`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'username': usernameInput.current ? usernameInput.current.value : '',
                    'email': emailInput.current ? emailInput.current.value : '',
                    'password': passwordInput.current ? passwordInput.current.value : ''
                })
            })
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message)
            }
            const data = await res.json()
            showNotification('success', data.message)
            setTimeout(() => {
                navigate('/login')
            }, 500)
        } catch (err) {
            showNotification('error', err.message)
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
        const text = "Welcome to our website!\nPlease sign up to continue... <3";
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
        <div className={styles.entireSignupPage + " w-full h-screen flex justify-center items-center"}>
            <div
                className={styles.formSignupBox + " w-auto h-auto bg-black/70 rounded-[10px] p-3 absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] border-[1px] border-solid border-white text-white flex justify-center"}
                onClick={addWaveAnimation}
            >
                <div className="min-w-[300px] flex justify-center relative mt-[40px]">
                    <p className={styles.typingText + " max-w-[200px] h-auto text-center relative p-0"} ref={typingText}>
                    </p>
                </div>
                <form onSubmit={handlerSignup} className="min-w-[250px] h-auto border-[1px] border-solid border-white rounded-[10px] p-[8px] relative">
                    <InputBox
                        id="username-input"
                        type="text"
                        label="Enter username: "
                        refName={usernameInput}
                    />
                    <InputBox
                        id="email-input"
                        type="text"
                        label="Enter email:"
                        refName={emailInput}
                    />
                    <InputBox
                        id="password-input"
                        type="password"
                        label="Enter password:"
                        refName={passwordInput}
                    />
                    <InputBox
                        id="confirm-password-input"
                        type="password"
                        label="Enter password again:"
                        refName={confirmPasswordInput}
                    />
                    <div className="flex justify-between mx-1 mt-[8px]">
                        <p>Already have an account?</p>
                        <Link to="/login/" className="text-blue-800 underline">Login</Link>
                    </div>
                    <button
                        type="submit"
                        className="globalButtonStyle w-full h-[30px] outline-none bg-blue-500 mt-[20px] flex justify-center items-center shadow-[2px_2px_2px_grey]"
                    >
                        Signup
                    </button>
                    <div className="relative w-full h-[1px] bg-slate-500 mt-8">
                        <span className="block absolute left-[50%] top-[-13px] bg-black px-2 transform translate-x-[-50%]">Or</span>
                    </div>
                    <div className="flex mt-[15px] border border-1px border-solid border-black cursor-pointer items-center pl-[8px] p-1 bg-white text-black">
                        <img src={googleIcon} className="w-[23px]" />
                        <p className="ml-[5px]">Signup with Google</p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
