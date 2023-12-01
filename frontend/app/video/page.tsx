"use client";

import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchGet } from "@/utilities/myFetch";
import wait from "@/utilities/wait";
import Subtable, { SubtableData } from "@/components/Subtable/Subtable";
import DATA from "@/components/Subtable/DummyData";

export default function Video() {
  const params = useSearchParams();

  const router = useRouter();
  const v = params.get("v");
  if (v === null || v === undefined || v === "") {
    router.push("/");
    return null;
  }

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
    queryKey: ["subtitles", "video", v],
    queryFn: () =>
      fetchGet("http://127.0.0.1:8000/videoPageCaptionData/" + v).then((r) =>
        r.json()
      ),
  });
  const subtitles: SubtableData = subtitlesQuery.isSuccess
    ? subtitlesQuery.data
    : [];

  // routing
  const handleSubmit = () => {
    router.push(`/editor?v=${v}`);
  };

  return (
    <div className={styles.columns}>
      <div className={styles.videoColumn}>
        <YoutubeEmbed embedId={v} />
        <p>Total Subtitles: {subtitles.length}</p>
        <p>
          Subs in {userLang}:{" "}
          {
            subtitles.filter(
              (s) => s.language.toLowerCase() === userLang.toLowerCase()
            ).length
          }
        </p>
        <p>
          Highest rating for your langauge:{" "}
          {Math.max(
            ...subtitles
              .filter(
                (s) => s.language.toLowerCase() === userLang.toLowerCase()
              )
              .map((s) => s.rating)
          )}
        </p>
        <button onClick={handleSubmit}>Make subs!</button>
        <button>{}</button>
      </div>
      <div className={styles.subsColumn}>
        <Subtable subtitles={subtitles} page="video" />
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
