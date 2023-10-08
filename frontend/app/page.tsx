"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
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
          <button onClick={handleSubmit}>Q</button>
        </div>
      </div>
      <p className={styles.context}>
        Use <Link href="/video?v=jK6W_nQjZyg">this link</Link> to quickly open a
        video.
        <br />
        <br />
        Big paragraph of context stuff below that roughly explains how the
        website works and what to use it for and all that junk idk that's what
        they do on the website im referencing and it looks pretty cool so i
        think we should consider that as an option im just filling text now lol
        i should rly learn how to use those lorem ipsum tools
        <br />
        <br />
        Big paragraph of context stuff below that roughly explains how the
        website works and what to use it for and all that junk idk that's what
        they do on the website im referencing and it looks pretty cool so i
        think we should consider that as an option im just filling text now lol
        i should rly learn how to use those lorem ipsum tools
        <br />
        <br />
        Big paragraph of context stuff below that roughly explains how the
        website works and what to use it for and all that junk idk that's what
        they do on the website im referencing and it looks pretty cool
      </p>
    </div>
  );
}
