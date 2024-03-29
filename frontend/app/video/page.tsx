"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import { fetchGet, fetchGetErrorHandled } from "@/utilities/myFetch";
import Subtable, { SubtableData } from "@/components/Subtable/Subtable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPost } from "@/utilities/myFetch";

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
      fetchGetErrorHandled("http://127.0.0.1:8000/currentLanguage"),
  });
  console.log(langaugeQuery.data);
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

  // creating a new timeline entry for the user
  const [showModal, setShowModal] = useState(false);
  const [isOverwrite, setIsOverwrite] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const handleOverwrite = () => {
    setShowModal(false);
    setIsOverwrite(true);
    createTimeline();
    router.push(`/editor?v=${v}`);
  };

  const handleBack = () => {
    setShowModal(false);
  };

  const { mutate: createTimeline } = useMutation({
    mutationFn: () =>
      fetchPost(
        "http://127.0.0.1:8000/editor/createNewTimeline/" +
          v +
          "/" +
          isOverwrite
      ),
    onSuccess: (data) => {
      if (data.warning) {
        setWarningMessage(data.warning);
        setShowModal(true);
      } else {
        router.push(`/editor?v=${v}`);
      }
    },
    onError: (error) => {
      alert(error);
    },
  });

  const handleSubmit = () => {
    createTimeline();
  };

  // saved video info
  const qc = useQueryClient();

  const savedVideoQuery = useQuery({
    queryKey: ["savedVideo", v],
    queryFn: () =>
      fetchGet("http://127.0.0.1:8000/isSaved/" + v).then((r) => r.json()),
  });
  const isSaved: boolean | undefined = savedVideoQuery.isSuccess
    ? savedVideoQuery.data
    : undefined;

  const savedVideoMutation = useMutation({
    mutationKey: ["savedVideo", v],
    mutationFn: (save: boolean) => {
      if (save) {
        return fetchPost("http://127.0.0.1:8000/saveVideo/" + v);
      } else {
        return fetchPost("http://127.0.0.1:8000/unsaveVideo/" + v);
      }
    },
    onSuccess: (_, save) => {
      qc.setQueryData(["savedVideo", v], save);
    },
  });

  return (
    <>
      <div className={styles.columns}>
        <div className={styles.videoColumn}>
          <YoutubeEmbed embedId={v} />
          <p>Total Subtitles: {subtitles.length}</p>
          {langaugeQuery.isSuccess && (
            <p>
              Subs in {userLang}:{" "}
              {
                subtitles.filter(
                  (s) => s.language.toLowerCase() === userLang.toLowerCase()
                ).length
              }
            </p>
          )}
          {langaugeQuery.isSuccess && (
            <p>
              Highest rating for your langauge:{" "}
              {Math.max(
                ...subtitles
                  .filter(
                    (s) => s.language.toLowerCase() === userLang.toLowerCase()
                  )
                  .map((s) => s.rating.averageRating)
              )}
            </p>
          )}
          {langaugeQuery.isSuccess && (
            <button onClick={handleSubmit}>Make subs!</button>
          )}
          {langaugeQuery.isSuccess &&
            (isSaved === undefined ? (
              <button onClick={() => {}}>...</button>
            ) : (
              <button onClick={() => savedVideoMutation.mutate(!isSaved)}>
                {isSaved ? "Unsave" : "Save"} video
              </button>
            ))}
          {showModal && (
            <div className={styles.modal}>
              <div className={styles.modalcontent}>
                <p> will style later i think, sorry </p>
                <h1>{warningMessage}</h1>
                <button onClick={handleBack}>Back</button>
                <button onClick={handleOverwrite}>
                  Overwrite Existing Timeline
                </button>
              </div>
            </div>
          )}
        </div>
        <div className={styles.subsColumn}>
          <Subtable subtitles={subtitles} page="video" />
        </div>
      </div>
    </>
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
