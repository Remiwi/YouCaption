"use client";
import Gsignin from "@/components/Auth/Gsignin"
import { useState } from "react";

export default function Test() {

    const [username, setUsername] = useState('');

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // Prevents the default form submit action

        const url = `http://127.0.0.1:8000/updateUsername/${username}`;
        console.log(await (await fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
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
    return (
        <>
            <Gsignin />
            <button
                onClick={async () =>  await fetch("http://127.0.0.1:8000/currentLanguage", {
                    mode: "cors",
                    credentials: "include",
                    headers: { 
                        "Access-Control-Allow-Origin": "https://localhost:3000",
                        "Cross-Origin-Resource-Policy": "cross-origin", 
                    },
                })}
                >
                    Get Current Language
            </button>
            <button
                onClick={async () =>  await fetch("http://127.0.0.1:8000/username", {
                    mode: "cors",
                    credentials: "include",
                //     headers: { 
                //         "Access-Control-Allow-Origin": "https://localhost:3000",
                //         "Cross-Origin-Resource-Policy": "cross-origin", 
                //     },
                // 
                })}
                > Get Username
            </button>
            <form onSubmit={handleSubmit}>
                Update Username<br />
                <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                />
                <input type="submit" />
            </form>
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
        </>
    )
}
