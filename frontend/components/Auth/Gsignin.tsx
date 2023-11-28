"use client";
import { useEffect, useState } from "react";
declare global {
  interface Window {
    handleCredentialResponse?: any;
  }
}

export default function Gsignin() {
  if (typeof window !== "undefined") {
    window.handleCredentialResponse = handleCredentialResponse;
  }

  // Must insert google button script on every component render
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  });

  async function decodeJwtResponse(credential: any) {
    let response = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "https://play.google.com",
        "Cross-Origin-Resource-Policy": "cross-origin",
      },
      body: "credential=" + credential,
    });
    response = await response.json();
    return response;
  }

  //callback for google sign in
  async function handleCredentialResponse(response: any) {
    console.log(response);
    const responsePayload: any = await decodeJwtResponse(response.credential);

    console.log("ID: " + responsePayload.sub);
    console.log("Full Name: " + responsePayload.name);
    console.log("Given Name: " + responsePayload.given_name);
    console.log("Family Name: " + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);
  }

  return (
    <>
      <div
        id="g_id_onload"
        data-client_id="258135953958-mgpvgvkajfc6gv30k6ldbih4v08deq45.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-login_uri="http://localhost:3000"
        data-callback="handleCredentialResponse"
        data-auto_prompt="false"
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="filled_blue"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </>
  );
}
