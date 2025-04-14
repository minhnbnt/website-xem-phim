import React, { useEffect, useState } from "react";
import decodeJWT from "../../utils/decodeJWT";
import styles from './UserDetail.module.css'
import { Link } from "react-router-dom";
import SpinAnimation from "../../components/LoadingAnimation/SpinAnimation/SpinAnimation";
import { useNotification } from "../../context/NotificationContext/NotificationContext";
import Header from "../../components/Header/Header";
import SideBar from "../../components/SideBar/SideBar";
import Marvel1 from "../../assets/marvel1.jpg";
import Marvel2 from "../../assets/marvel2.jpg";
import Image from "../../components/Image/Image";

//"https://img.icons8.com/material/30/person-male.png"

const UserDetail = () => {
  const [image, setImage] = useState(null);
  const [passwordChangingBox, setPasswordChangingBox] = useState()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('evdUserInfo')))
  const [authenticatedPassword, setAuthenticatedPassword] = useState(true)
  const jwtToken = JSON.parse(localStorage.getItem('evdToken'))
  const decodedToken = jwtToken ? decodeJWT(jwtToken) : null
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { showNotification } = useNotification()

  const handleUpload = () => {
    try {
      const fetchUserInfo = async () => {
        const res = await fetch(`${import.meta.env.VITE_APP_WEBSITE_BASE_URL}identity/api/users/${user.id}/upload`, {
          method: "POST",
          headers: {
            'Content-Type': '',
            // 'Authorization': `Bearer ${jwtToken}`
          }
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || "Cann't load the user information!")
        }
        const data = await res.json()
        console.log('data:', data);
        localStorage.setItem('evdUserInfo', JSON.stringify(data.result))
        setUser(data.result)
      }
      if (!user) {
        fetchUserInfo()
      }
    } catch (err) {
      alert(err)
    }
  }

  useEffect(() => {
    try {
      const fetchUserInfo = async () => {
        const res = await fetch(`${import.meta.env.VITE_APP_WEBSITE_BASE_URL}identity/users/myinfo`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || "Cann't load the user information!")
        }
        const data = await res.json()
        localStorage.setItem('evdUserInfo', JSON.stringify(data.result))
        setUser(data.result)
      }
      if (!user) {
        // fetchUserInfo()
      }
    } catch (err) {
      alert(err)
    }
  }, [user])

  const authenticatePassword = (e) => {
    const fetchPassword = async () => {
      const res = await fetch(`${import.meta.env.VITE_APP_WEBSITE_BASE_URL}identity/auth/authenticate-password`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'email': user.email,
          'password': e.target.value
        })
      })
      const data = await res.json()
      if (data.code !== 2000) {
        setAuthenticatedPassword(false)
      } else {
        setAuthenticatedPassword(true)
      }
    }
    if (e.target.value) {
      fetchPassword()
    }
  }

  const handleChangingPassword = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const changePassword = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_WEBSITE_BASE_URL}identity/users/update-password/${user.id}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'password': formData.get("newPassword")
          })
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || "Cann't update password!")
        }
        setLoading(false)
        const data = await res.json()
        showNotification('success', data.message)
      } catch (err) {
        setLoading(false)
        showNotification('error', err.message)
      }
    }

    if (authenticatedPassword) {
      changePassword()
    }
  }

  return (
    <div className="w-auto h-screen flex text-white relative box-border">
      <Header
        onSearching={() => { }}
        onReset={() => { }}
      />
      <SideBar onActiveMenuUpdate={() => { }} />
      <div className={styles.userDetailBox + " w-[80%] h-[300px] border-[2px] border-solid border-[red] rounded-[8px] flex ml-[20%] mt-[50px]"}>
        <div className={styles.avatarBox + " avatar-box w-[50%] h-[100%] flex flex-col items-center justify-center relative bg-black/50"}>
          {user ? <img
            className={styles.avatarImg + " w-[80%] h-[80%] rounded-[50%]"}
            src={image ? image : `data:image/png;base64,${user.avatarData}`}
          /> : <img
            src={Marvel1}
            alt="person-male"
            className="w-[260px] h-[260px] rounded-[50%] bg-white absolute top-[100%] left-[20%] transform translate-y-[-50%]"
          />}
          <p className="text-[130%]">{user ? user.username : ''}</p>
        </div>
        <div className="w-[50%] h-[100%] p-[5px] flex flex-col justify-center items-center bg-black/50">
          <p><b>Username:</b> {user ? user.username : ''}</p>
          <p><b>Email:</b> {user ? user.email : ''}</p>
          <p><b>Account Creating Time:</b> {user ? user.accountCreatingTime : ''}</p>
          <button onClick={() => setPasswordChangingBox(true)}>Change password</button>
          <input type="file" onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))} />
          <button onClick={() => handleUpload()}>Upload</button>
          <Link to="/home">Home</Link>
        </div>
      </div>
      {passwordChangingBox ? <div className={styles.passwordChangingBox + " fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center overflow-hidden z-[1000]"}>
        <div
          className="overlay absolute top-0 right-0 left-0 bottom-0 bg-[rgba(100,116,139,0.5)] z-0 cursor-pointer"
          onClick={() => {
            setPasswordChangingBox(false)
            setAuthenticatedPassword(true)
          }}
        >
        </div>
        <form className="passwordChangingForm w-[300px] h-[210px] relative p-[10px] rounded-[10px] bg-white flex flex-col items-center justify-center text-black z-10" onSubmit={handleChangingPassword}>

          <div className="oldPasswordField w-full h-[32px] border border-[1px] border-solid border-[black] rounded-[5px] p-[5px] mt-[5px] mb-[8px] flex justify-center items-center">
            <input type={showPassword ? "text" : "password"} name="oldPassword" className="outline-none w-full h-full" placeholder="Old password" onBlur={authenticatePassword} required />
            <img width="17px" height="17px" src={showPassword ? "https://img.icons8.com/ios-glyphs/30/hide.png" : "https://img.icons8.com/material-two-tone/24/visible.png"} alt={showPassword ? "hide" : "visible"} onClick={() => setShowPassword(!showPassword)} />
          </div>
          {authenticatedPassword ? '' : <p className="passwordAuthenticationResult p-0 text-red-500 mt-[-8px] mb-[3px]">Password is incorrect!</p>}

          <div className="newPasswordField w-full h-[32px] border border-[1px] border-solid border-[black] rounded-[5px] mb-[8px] p-[5px] flex justify-center items-center">
            <input type={showPassword ? "text" : "password"} name="newPassword" className="outline-none w-full h-full" placeholder="New password" required />
            <img width="17px" height="17px" src={showPassword ? "https://img.icons8.com/ios-glyphs/30/hide.png" : "https://img.icons8.com/material-two-tone/24/visible.png"} alt={showPassword ? "hide" : "visible"} onClick={() => setShowPassword(!showPassword)} />
          </div>

          <div className="confirmPasswordField w-full h-[32px] border border-[1px] border-solid border-[black] rounded-[5px] mb-[8px] p-[5px] flex justify-center items-center">
            <input type={showPassword ? "text" : "password"} name="confirmPassword" className="outline-none w-full h-full" placeholder="Confirm password" required />
            <img width="17px" height="17px" src={showPassword ? "https://img.icons8.com/ios-glyphs/30/hide.png" : "https://img.icons8.com/material-two-tone/24/visible.png"} alt={showPassword ? "hide" : "visible"} onClick={() => setShowPassword(!showPassword)} />
          </div>
          <button
            onClick={() => {
              setPasswordChangingBox(false)
              setAuthenticatedPassword(true)
            }}
            className="w-[23px] h-[23px] absolute top-[5px] right-[5px] cursor-pointer text-[120%] flex items-center justify-center"
            title="Come out"
          >
            x
          </button>
          <button
            type="submit"
            className="globalButtonStyle w-[60px] h-[30px] flex justify-center items-center"
          >
            {loading ? <SpinAnimation
              onLoading={loading}
              style={{
                width: '22px',
                height: '22px',
                border: '4px solid white',
              }}
            >
            </SpinAnimation> : 'Save'}
          </button>
        </form>
      </div> : ''}
    </div>
  );
};

export default UserDetail;
