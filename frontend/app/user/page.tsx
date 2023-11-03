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

  const [subtitles, setSubtitles] = useState(DATA);
  const USER_LANG = "english";

  const totalSubs = subtitles.length;
  const subsInYourLang = subtitles.filter(
    (s) => s.language.toLowerCase() === USER_LANG
  ).length;
  const avgRating = subtitles.reduce((acc, s) => acc + s.rating, 0) / totalSubs;
  const avgRatingInYourLang =
    subtitles
      .filter((s) => s.language.toLowerCase() === USER_LANG)
      .reduce((acc, s) => acc + s.rating, 0) / subsInYourLang;

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
              <p>{totalSubs} subtitles</p>
              <p>{subsInYourLang} in your language</p>
            </div>
            <div className={styles.stat}>
              <p>{avgRating.toFixed(1)} avg rating</p>
              <p>{avgRatingInYourLang.toFixed(1)} in your language</p>
            </div>
            <p>? followers</p>
          </div>
        </div>
      </div>
      <Subtable subtitles={DATA} page="author" />
    </div>
  );
}
