"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Video() {
  const params = useSearchParams();
  const router = useRouter();
  const v = params.get("v");
  if (v === null || v === undefined || v === "") {
    router.push("/");
    return null;
  }

  return <h1>{v}</h1>;
}
