"use client";
import Gsignin from "@/components/Auth/Gsignin"

export default function Test() {
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
            <button
                onClick={async () =>  console.log(await (await fetch("http://127.0.0.1:8000/follow/UniqueBaron8851", {
                    mode: "cors",
                    credentials: "include",
                })).json())
                }
                > Follow
            </button>
        </>
    )
}
