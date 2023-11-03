"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

import Subtable from "@/components/Subtable/Subtable";
import DATA from "@/components/Subtable/DummyData";

export default function Video() {
  const params = useSearchParams();
  const router = useRouter();
  const v = params.get("v");
  if (v === null || v === undefined || v === "") {
    router.push("/");
    return null;
  }

  const [subtitles, setSubtitles] = useState(DATA);
  const USER_LANG = "english";

  return (
    <div className={styles.columns}>
      <div className={styles.videoColumn}>
        <YoutubeEmbed embedId={v} />
        <p>Total Subtitles: {subtitles.length}</p>
        <p>
          Subs in your language:{" "}
          {
            subtitles.filter((s) => s.language.toLowerCase() === USER_LANG)
              .length
          }
        </p>
        <p>
          Highest rating for your langauge:{" "}
          {Math.max(
            ...subtitles
              .filter((s) => s.language.toLowerCase() === USER_LANG)
              .map((s) => s.rating)
          )}
        </p>
        <button>Make subs!</button>
      </div>
      <div className={styles.subsColumn}>
        <Subtable subtitles={DATA} page="video" />
      </div>
    </div>
  );
}

type YoutubeEmbedProps = {
  embedId: string;
};

const YoutubeEmbed = (props: YoutubeEmbedProps) => (
  <iframe
    className={styles.embed}
    src={`https://www.youtube.com/embed/${props.embedId}`}
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
);
