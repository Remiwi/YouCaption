"use client";

import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

import Subtable from "@/components/Subtable/Subtable";

export default function Video() {
  const params = useSearchParams();
  const router = useRouter();
  const v = params.get("v");
  if (v === null || v === undefined || v === "") {
    router.push("/");
    return null;
  }

  return (
    <div className={styles.columns}>
      <div className={styles.videoColumn}>
        <YoutubeEmbed embedId={v} />
        <p>Total Subtitles: 3</p>
        <p>Subs in your language: 2</p>
        <p>Highest rating for your langauge: 5</p>
        <button>Make subs!</button>
      </div>
      <div className={styles.subsColumn}>
        <Subtable subtitles={[]} />
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
