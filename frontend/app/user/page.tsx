"use client";

import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchGet } from "@/utilities/myFetch";

import Subtable, { SubtableData } from "@/components/Subtable/Subtable";

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
      fetch("http://127.0.0.1:8000/userFollowerCount/" + u).then((res) =>
        res.json()
      ),
  });
  const followers = followersQuery.isSuccess ? followersQuery.data : "?";

  // get language
  const langaugeQuery = useQuery({
    queryKey: ["language"],
    queryFn: () =>
      fetchGet("http://127.0.0.1:8000/currentLanguage").then((r) => r.json()),
  });
  const userLang = langaugeQuery.isSuccess
    ? langaugeQuery.data
    : "your language";

  // get subtitles
  const subtitlesQuery = useQuery({
    queryKey: ["subtitles", "author", u],
    queryFn: () =>
      fetchGet("http://127.0.0.1:8000/userPageCaptionData/" + u).then((r) =>
        r.json()
      ),
  });
  const subtitles: SubtableData = subtitlesQuery.isSuccess
    ? subtitlesQuery.data
    : [];

  // stats from data
  const totalSubs = subtitles.length;
  const subsInYourLang = subtitles.filter(
    (s) => s.language.toLowerCase() === userLang.toLowerCase()
  ).length;
  const avgRating = subtitles.reduce((acc, s) => acc + s.rating, 0) / totalSubs;
  const avgRatingInYourLang =
    subtitles
      .filter((s) => s.language.toLowerCase() === userLang.toLowerCase())
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
              <p>
                {subsInYourLang} in {userLang}
              </p>
            </div>
            <div className={styles.stat}>
              <p>{avgRating.toFixed(1)} avg rating</p>
              <p>
                {avgRatingInYourLang.toFixed(1)} in {userLang}
              </p>
            </div>
            <p>{followers} followers</p>
          </div>
        </div>
      </div>
      <Subtable subtitles={subtitles} page="author" />
    </div>
  );
}
