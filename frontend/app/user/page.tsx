"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useQuery } from "@tanstack/react-query";
import wait from "@/utilities/wait";

import Subtable from "@/components/Subtable/Subtable";
import DATA from "@/components/Subtable/DummyData";

export default function User() {
  // route parameters
  const params = useSearchParams();
  const router = useRouter();
  const u = params.get("u");
  if (u === null || u === undefined || u === "") {
    router.push("/");
    return null;
  }

  // get follower count
  const followersQuery = useQuery({
    queryKey: ["followers", u],
    queryFn: () =>
      fetch("http://localhost:8000/dummy/" + u)
        .then((res) => res.json())
        .then((data) => data.followers),
  });
  const followers = followersQuery.isLoading ? "?" : followersQuery.data;

  // get user language
  const langaugeQuery = useQuery({
    queryKey: ["language"],
    queryFn: () => wait(1000).then(() => "english"),
  });
  const userLang = langaugeQuery.isSuccess ? langaugeQuery.data : "???";

  // get subtitles
  const subtitlesQuery = useQuery({
    queryKey: ["subtitles", "author", u],
    queryFn: () => wait(1000).then(() => DATA),
  });
  const subtitles = subtitlesQuery.isSuccess ? subtitlesQuery.data : [];

  // stats from data
  const totalSubs = subtitles.length;
  const subsInYourLang = subtitles.filter(
    (s) => s.language.toLowerCase() === userLang
  ).length;
  const avgRating = subtitles.reduce((acc, s) => acc + s.rating, 0) / totalSubs;
  const avgRatingInYourLang =
    subtitles
      .filter((s) => s.language.toLowerCase() === userLang)
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
            <p>{followers} followers</p>
          </div>
        </div>
      </div>
      <Subtable subtitles={subtitles} page="author" />
    </div>
  );
}
