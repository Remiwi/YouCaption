"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [signedIn, setSignedIn] = useState(true); // TODO: replace with auth check

  return (
    <div className={styles.navbar}>
      <Link href="/" style={{ textDecoration: "none" }}>
        <h1>
          <mark>You</mark>Caption
        </h1>
      </Link>
      <div>
        <p>{signedIn ? "Hello, friend!" : "Hello, stranger!"}</p>
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
        <button onClick={() => setSignedIn(!signedIn)}>
          {signedIn ? "Sign out" : "Sign in"}
        </button>
      </div>
    </div>
  );
}
