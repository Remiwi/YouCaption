"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import wait from "@/utilities/wait";
import Gsignin from "../Auth/Gsignin";
import test from "node:test";

export default function Navbar() {
  // async function test_logout() {
  //   await fetch("http://127.0.0.1:8000/logout", {
  //     method: "POST",
  //     mode: "cors",
  //     credentials: "include",
  //   });
  //   window.location.reload();
  // }
  const usernameQuery = useQuery({
    queryKey: ["username"],
    queryFn: () =>
      fetch("http://127.0.0.1:8000/getUsername", {
        method: "GET",
        mode: "cors",
        credentials: "include",
      }).then((res) => res.json()),
  });
  const logoutMutation = useMutation({
    mutationKey: ["username"],
    mutationFn: () =>
      fetch("http://127.0.0.1:8000/logout", {
        method: "POST",
        mode: "cors",
        credentials: "include",
      }),
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
      {usernameQuery.isSuccess && (
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
          {signedIn && (
            <button
              onClick={() => {
                logoutMutation.mutate();
                window.location.reload();
              }}
            >
              Sign out
            </button>
          )}
          {!signedIn && <Gsignin />}
        </div>
      )}
    </div>
  );
}
