import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <h1>
        <mark>You</mark>Caption
      </h1>
      <div>
        <p>Hello, stranger!</p>
        <button>Sign in</button>
      </div>
    </div>
  );
}
