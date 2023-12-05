"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import extractVideoID from "@/utilities/extractVideoID";

export default function Home() {
  const router = useRouter();
  const input = useRef<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    input.current = e.target.value;
  };

  const handleSubmit = () => {
    if (input.current === "") return;
    router.push(`/video?v=${extractVideoID(input.current)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.search}>
        <h1>What will you caption?</h1>
        <div className={styles.searchBar}>
          <input
            type="text"
            className="text-line"
            placeholder="www.youtube.com/watch?v=dQw4w9WgXcQ"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSubmit}>
            <Image
              src="/icons/search.png"
              alt="Search icon"
              width={100}
              height={100}
            />
          </button>
        </div>
      </div>
      <p className={styles.context}>
        Use <Link href="/video?v=jK6W_nQjZyg">this link</Link> to quickly open a
        video.
        <br />
        <br />
        YouCaption is an online platform for creating and distributing subtitles for videos made by independent digital creators.
        <br />
        <br />
        Using YouCaption, you have access to an easy to a caption editor to create awesome subtitles.
        You can upload subtitles (from our editor or even from other outside sources) to be associated with corresponding videos, 
        rate subtitles made by other users, and browse existing subtitles created for a myriad of videos.
        <br />
        <br />
        With YouCaption, users will be able to make subtitles for videos or creators that they like and distribute them to other fans who need them as easy as 1-2-3!
        <br />
        <br />
        The discontinuation of Youtube's Community Captions in 2020 left users who needed the increased accessibility unprovided for. 
        Youtube cited the 0.2% of users who used the Community Captioning service as too small a pool,
        but this is not too small at all to us. 
        <br />
        <br />
        There are currently over 5% of the world's population who are deaf or hard of hearing, which is around 430 Million people, according to the World Health Organization.
        This value is also expected to increase by 2050 to over 700 million, which can also be estimated as 1 in 10 people.
        Because of this, we sincerely and passionately believe in furthering accessibility online.
        <br />
        <br />
      </p>
    </div>
  );
}
