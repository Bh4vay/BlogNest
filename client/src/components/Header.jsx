import React, { useContext, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import logo from '/logo.jpg'

const Header = () => {
    const navigate = useNavigate();
    const  {userInfo, setUserInfo} = useContext(UserContext)
    useEffect(() => {
        fetch(`https://blog-nest-server-gamma.vercel.app//profile`, {
            credentials: 'include'
        }).then(response => {
            response.json().then(userInfo => {
                // setUsername(userInfo.username)
                setUserInfo(userInfo)

            })
        })
    }, [])

    function logout(){
        fetch(`https://blog-nest-server-gamma.vercel.app//logout`,{
            method: 'POST',
            credentials: 'include',
        })
        setUserInfo(null);
        navigate('/login')
    }
    const username = userInfo?.username;

    return (
        <header>
            <Link to="/" className='logo'>
            <img src={logo} alt="" height={45} />
            </Link>
            <nav>
                {
                    username && (
                        <>
                            <Link to='/create'>Create new Post</Link>
                            <a onClick={logout}>Logout</a>
                        </>
                    )
                }
                {!username && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )
                }

            </nav>
        </header>
    )
}

export default Header
