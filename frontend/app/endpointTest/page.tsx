"use client";
import Gsignin from "@/components/Auth/Gsignin"
import { useState } from "react"

export default function Test() {

    const [username, setUsername] = useState('');
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // Prevents the default form submit action

        const url = `http://127.0.0.1:8000/updateUsername/${username}`;
        console.log(await (await fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            // headers: {
            //     "Content-Type": "application/x-www-form-urlencoded",
            // }
        })).json());
    };

    const [videoID, setVideoID] = useState('')
    const handleSubmitSubscribe = async (e: {preventDefault: () => void}) => {
        e.preventDefault()

        const url = `http://127.0.0.1:8000/subscribe/${videoID}`
        console.log(await (await fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })).json());
    }
    const handleSubmitUnsubscribe = async (e: {preventDefault: () => void}) => {
        e.preventDefault()

        const url = `http://127.0.0.1:8000/unsubscribe/${videoID}`
        console.log(await (await fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })).json());
    }

    const [language, setLanguage] = useState('')
    const handleSubmitLanguage = async (e: {preventDefault: () => void}) => {
        e.preventDefault()

        const url = `http://127.0.0.1:8000/updateLanguage/${language}`
        console.log(await (await fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })).json());
    }

    const getCaptionsFromVideoID = async (e: {preventDefault: () => void}) => {
        e.preventDefault()

        const url = `http://127.0.0.1:8000/vidPgCapData/${videoID}`
        console.log(await (await fetch(url, {
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })).json());
    }
    const getCaptionsFromUsername = async (e: {preventDefault: () => void}) => {
        e.preventDefault()

        const url = `http://127.0.0.1:8000/pfPgCapData/${username}`
        console.log(await (await fetch(url, {
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })).json());
    }

    const [captionID, setCaptionID] = useState("")
    const [rating, setRating] = useState(1)
    const handleSubmitRating = async (e: {preventDefault: () => void}) => {
        e.preventDefault()
        console.log(Number(captionID))
        const url = `http://127.0.0.1:8000/createUserRating/${Number(captionID)}/${rating}`
        console.log(await (await fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })).json());
    }

    const handleSubmitGetRatings = async (e: {preventDefault: () => void}) => {
        e.preventDefault()
        console.log(Number(captionID))
        const url = `http://127.0.0.1:8000/userFollowerCount/${username}`
        console.log(await (await fetch(url, {
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })).json());
    }
    
    const handleSubmitGetSubListVideo = async (e: {preventDefault: () => void}) => {
        e.preventDefault()
        console.log(Number(captionID))
        const url = `http://127.0.0.1:8000/subscriptionListVideo/${videoID}`
        console.log(await (await fetch(url, {
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })).json());
    }
    
    const handleSubmitGetSubListUser = async (e: {preventDefault: () => void}) => {
        e.preventDefault()
        console.log(Number(captionID))
        const url = `http://127.0.0.1:8000/subscriptionListUser/${username}`
        console.log(await (await fetch(url, {
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })).json());
    }
    return (
        <>
            <Gsignin />
            <form onSubmit={handleSubmit}>
                Change Username<br />
                <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                />
                <input type="submit" />
            </form>
            <button
                onClick={async () =>  console.log(await(await fetch("http://127.0.0.1:8000/currentLanguage", {
                    mode: "cors",
                    credentials: "include",
                    headers: { 
                        "Access-Control-Allow-Origin": "https://localhost:3000",
                        "Cross-Origin-Resource-Policy": "cross-origin", 
                    },
                })).json())}
                >
                    Get Current Language
            </button>
            <button
                onClick={async () =>  console.log(await(await fetch("http://127.0.0.1:8000/getUsername", {
                    mode: "cors",
                    credentials: "include",
                //     headers: { 
                //         "Access-Control-Allow-Origin": "https://localhost:3000",
                //         "Cross-Origin-Resource-Policy": "cross-origin", 
                //     },
                // 
                })).json())}
                > Get Username
            </button>
            <button
                onClick={async () =>  console.log(await (await fetch("http://127.0.0.1:8000/follow/UniqueBaron8851", {
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                })).json())
                }
                > Follow
            </button>
            <button
                onClick={async () =>  console.log(await (await fetch("http://127.0.0.1:8000/unfollow/UniqueBaron8851", {
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                })).json())
                }
                > Unfollow
            </button>
            <button
                onClick={async () =>  console.log(await (await fetch("http://127.0.0.1:8000/followingList", {
                    mode: "cors",
                    credentials: "include",
                })).json())
                }
                > Get Following List
            </button>
            <form onSubmit={handleSubmitSubscribe}>
                Subscribe to Video<br />
                <input 
                    type="text" 
                    value={videoID} 
                    onChange={e => setVideoID(e.target.value)} 
                />
                <input type="submit" />
            </form>
            <form onSubmit={handleSubmitUnsubscribe}>
                Unsubscribe to Video<br />
                <input 
                    type="text" 
                    value={videoID} 
                    onChange={e => setVideoID(e.target.value)} 
                />
                <input type="submit" />
            </form>
            <button
                onClick={async () =>  console.log(await (await fetch("http://127.0.0.1:8000/subscriptionList", {
                    mode: "cors",
                    credentials: "include",
                })).json())
                }
                > Get Subscription List
            </button>
            <form onSubmit={handleSubmitLanguage}>
                Change Language<br />
                <input 
                    type="text" 
                    value={language} 
                    onChange={e => setLanguage(e.target.value)} 
                />
                <input type="submit" />
            </form>
            <button
                onClick={async () =>  console.log(await (await fetch("http://127.0.0.1:8000/onlyNotifyOnLangMatchFollowingTrue", {
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                })).json())
                }
                > Lange Match Following True
            </button>
            <button
                onClick={async () =>  console.log(await (await fetch("http://127.0.0.1:8000/onlyNotifyOnLangMatchFollowingFalse", {
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                })).json())
                }
                > Lange Match Following False
            </button>
            <button
                onClick={async () =>  console.log(await (await fetch("http://127.0.0.1:8000/onlyNotifyOnLangMatchVideosTrue", {
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                })).json())
                }
                > Lange Match Videos True
            </button>
            <button
                onClick={async () =>  console.log(await (await fetch("http://127.0.0.1:8000/onlyNotifyOnLangMatchVideosFalse", {
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                })).json())
                }
                > Lange Match Videos False
            </button>
            <button
                onClick={async () =>  console.log(await (await fetch("http://127.0.0.1:8000/followNotificationSettings", {
                    mode: "cors",
                    credentials: "include",
                })).json())
                }
                > Get Follow Notification Setting
            </button>
            <button
                onClick={async () =>  console.log(await (await fetch("http://127.0.0.1:8000/subscriptionNotificationSettings", {
                    mode: "cors",
                    credentials: "include",
                })).json())
                }
                > Get Subscription Notification Setting
            </button>
            <button
                onClick={async () =>  console.log(await (await fetch("http://127.0.0.1:8000/subscriptionNotificationSettings", {
                    mode: "cors",
                    credentials: "include",
                })).json())
                }
                > Get Subscription Notification Setting
            </button>
            <form onSubmit={getCaptionsFromVideoID}>
                Get Captions from VideoID<br />
                <input 
                    type="text" 
                    value={videoID} 
                    onChange={e => setVideoID(e.target.value)} 
                />
                <input type="submit" />
            </form>
            <form onSubmit={getCaptionsFromUsername}>
                Get Captions from Username<br />
                <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                />
                <input type="submit" />
            </form>
            <form onSubmit={handleSubmitRating}>
                Create Captions<br />
                <input 
                    type="text" 
                    value={captionID} 
                    onChange={e => setCaptionID(e.target.value)} 
                />
                <input type="submit" />
            </form>
            <form onSubmit={handleSubmitGetRatings}>
                Get Ratings For<br />
                <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                />
                <input type="submit" />
            </form>
            <form onSubmit={handleSubmitGetSubListVideo}>
                Get SubList Video<br />
                <input 
                    type="text" 
                    value={videoID} 
                    onChange={e => setVideoID(e.target.value)} 
                />
                <input type="submit" />
            </form>
            <form onSubmit={handleSubmitGetSubListUser}>
                Get SubList User<br />
                <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                />
                <input type="submit" />
            </form>
        </>
    )
}
