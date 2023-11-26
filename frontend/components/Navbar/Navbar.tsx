"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import wait from "@/utilities/wait";
import Gsignin from "../Auth/Gsignin";

export default function Navbar() {
  const usernameQuery = useQuery({
    queryKey: ["username"],
    queryFn: () =>
      fetch("http://localhost:8000/getUsername").then((res) => res.json()),
  });
  const signedIn = usernameQuery.isSuccess && usernameQuery.data.signedIn;
  const username = signedIn ? usernameQuery.data.username : "...";

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
        {/* <button onClick={() => setSignedIn(!signedIn)}>
          {signedIn ? "Sign out" : "Sign in"}
        </button> */}
        <Gsignin />
      </div>
    </div>
  );
}
