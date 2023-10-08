import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.search}>
        <h1>What will you caption?</h1>
        <div className={styles.searchBar}>
          <input
            type="text"
            className="text-line"
            placeholder="www.youtube.com/watch?v=dQw4w9WgXcQ"
          />
          <button>Q</button>
        </div>
      </div>
      <p className={styles.context}>
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
