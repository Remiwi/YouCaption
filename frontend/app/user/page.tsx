"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

import Subtable from "@/components/Subtable/Subtable";
import DATA from "@/components/Subtable/DummyData";

export default function User() {
  const params = useSearchParams();
  const router = useRouter();
  const u = params.get("u");
  if (u === null || u === undefined || u === "") {
    router.push("/");
    return null;
  }

  return (
    <div className={styles.column}>
      <div className={styles.userHeader}>
        <div className={styles.fakePFP}>
          <p>{u[0]}</p>
        </div>
        <div className={styles.headerRows}>
          <div className={styles.usernameRow}>
            <p>{u}</p>
            <button>Follow</button>
          </div>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <p>200 posts</p>
              <p>100 in your language</p>
            </div>
            <div className={styles.stat}>
              <p>4.1 avg rating</p>
              <p>4.8 in your language</p>
            </div>
            <p>123 followers</p>
          </div>
        </div>
      </div>
      <Subtable subtitles={DATA} page="author" />
    </div>
  );
}
