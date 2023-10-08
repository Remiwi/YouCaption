import styles from "./Navbar.module.css";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <Link href="/" style={{ textDecoration: "none" }}>
        <h1>
          <mark>You</mark>Caption
        </h1>
      </Link>
      <div>
        <p>Hello, stranger!</p>
        <button>Sign in</button>
      </div>
    </div>
  );
}
