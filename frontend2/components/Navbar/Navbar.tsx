"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import wait from "@/utilities/wait";
import Gsignin from "../Auth/Gsignin";
import test from "node:test";

export default function Navbar() {
  const usernameQuery = useQuery({
    queryKey: ["username"],
    queryFn: async () => {
        const response = await test_getUsername();
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }
  });
  
  const signedIn = usernameQuery.isSuccess && usernameQuery.data.signedIn;
  const username = signedIn ? usernameQuery.data.username : "...";

  async function test_getUsername() {
    let response = await fetch("http://127.0.0.1:8000/getUsername", {
        method: "GET",
        mode: "cors",
        credentials: "include",
    })
    console.log(response)
    return response
  }
  
  async function test_logout() {
    let response = await fetch("http://127.0.0.1:8000/logout", {
      method: "POST",
      mode: "cors",
      credentials: "include",
    });
    console.log(response);
  }

  return (
    <div className={styles.navbar}>
      <Link href="/" style={{ textDecoration: "none" }}>
        <h1>
          <mark>You</mark>Caption
        </h1>
      </Link>
      <div>
        <p>{signedIn ? "Hello, " + username + "!" : "Hello, stranger!"}</p>
        {signedIn && (
          <Link href="/settings" style={{ textDecoration: "none" }}>
            <button className={styles.settings}>
              <Image
                src="/icons/settings.png"
                alt="settings image"
                width={500}
                height={500}
              />
            </button>
          </Link>
        )}
        {signedIn && <button onClick={test_logout}>Sign out</button>}
        {!signedIn && <Gsignin />}
      </div>
    </div>
  );
}
