"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Gsignin from "../Auth/Gsignin";
import { fetchGet } from "@/utilities/myFetch";

export default function Navbar() {
  const queryClient = useQueryClient();

  const usernameQuery = useQuery({
    queryKey: ["username"],
    queryFn: () =>
      fetchGet("http://127.0.0.1:8000/getUsername").then((res) => res.json()),
  });
  const logoutMutation = useMutation({
    mutationKey: ["username"],
    mutationFn: () =>
      fetch("http://127.0.0.1:8000/logout", {
        method: "POST",
        credentials: "include",
        mode: "cors",
      }).then((res) => {
        if (res.ok) {
          return res;
        } else {
          throw new Error("Failed to logout");
        }
      }),
    onSuccess: () => {
      usernameQuery.refetch();
      queryClient.resetQueries({ queryKey: ["language"] });
      queryClient.resetQueries({ queryKey: ["username"] });
      queryClient.invalidateQueries();
    },
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
