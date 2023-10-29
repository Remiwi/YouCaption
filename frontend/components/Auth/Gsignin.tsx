"use client";
import { useEffect } from "react";


export default function Gsignin() {
    // Must insert google button script on every component render
    useEffect(() => {
        const script = document.createElement('script')
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        script.defer = true

        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    })

    /* function handleCredentialResponse(response) {
        send response to backend -> decode + validate (authlib + google-auth) ->
        account creation / session mgmt -> return needed info
    } */
    return (
        <>
            <div id="g_id_onload"
                data-client_id="258135953958-mgpvgvkajfc6gv30k6ldbih4v08deq45.apps.googleusercontent.com"
                data-context="signin"
                data-ux_mode="popup"
                data-login_uri="http://localhost:3000"
                //data-callback = "handleCredentialResponse"
                data-auto_prompt="false">
            </div>

            <div className="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="filled_blue"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left">
            </div>
        </>
    )
}