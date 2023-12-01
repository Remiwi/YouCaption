"use client";

import styles from "./page.module.css";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FollowTable from "@/components/FollowTable/FollowTable";
import FOLLOWDATA from "@/components/FollowTable/DummyData";
import SubscriptionTable from "@/components/SubscriptionTable/SubscriptionTable";
import SUBCRIPTIONDATA from "@/components/SubscriptionTable/DummyData";

import wait from "@/utilities/wait";
import { fetchGet, fetchPost } from "@/utilities/myFetch";

export default function SettingsPage() {
  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("");

  // Get username
  const usernameQuery = useQuery({
    queryKey: ["username"],
    queryFn: () =>
      fetchGet("http://127.0.0.1:8000/getUsername").then((res) => res.json()),
  });
  const currentUsername = usernameQuery.isSuccess
    ? usernameQuery.data.username
    : "";

  // Update username
  const { mutate: mutateUsername } = useMutation({
    mutationFn: () =>
      fetchPost("http://127.0.0.1:8000/updateUsername/" + username),
    onSuccess: () => {
      queryClient.setQueryData(["username"], {
        username: username,
        signedIn: true,
      });
    },
  });

  // Get language
  const languageQuery = useQuery({
    queryKey: ["language"],
    queryFn: () =>
      fetchGet("http://127.0.0.1:8000/currentLanguage").then((res) =>
        res.json()
      ),
  });
  const currentLanguage = languageQuery.isSuccess ? languageQuery.data : "";

  // Update language
  const { mutate: mutateLanguage } = useMutation({
    mutationFn: () =>
      fetchPost("http://127.0.0.1:8000/updateLanguage/" + language),
    onSuccess: () => {
      queryClient.setQueryData(["language"], language);
    },
  });

  // Get follow list
  const followQuery = useQuery({
    queryKey: ["following"],
    queryFn: () => wait(1000).then(() => FOLLOWDATA),
  });
  const following = followQuery.isSuccess ? followQuery.data : [];

  // Get subscription list
  const subscriptionQuery = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => wait(1000).then(() => SUBCRIPTIONDATA),
  });
  const subscriptions = subscriptionQuery.isSuccess
    ? subscriptionQuery.data
    : [];

  return (
    <div className={styles.container}>
      <h1>Settings</h1>
      <div className={styles.grid}>
        <p className={styles.langText}>Change username:</p>
        <div className={styles.langPrompt}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder={currentUsername}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <p className={styles.langText}>Preferred Language:</p>
        <div className={styles.langPrompt}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder={currentLanguage}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </div>
        </div>
        <FollowTable users={[]} />
        <FakeForm
          text="Get notified when an author you follow publishes?"
          thirdOption="Only for channels I'm subscribed to"
        />
        <SubscriptionTable videos={[]} />
        <FakeForm
          text="Get notified when a channel you subscribe to gets a new post?"
          thirdOption="Only from authors I follow"
        />
        <div />
        <div className={styles.submitButton}>
          <button
            onClick={() => {
              if (username !== "") {
                mutateUsername();
              }
              if (language !== "") {
                mutateLanguage();
              }
              window.location.reload();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

type FakeFormProps = {
  text: string;
  thirdOption: string;
};

function FakeForm({ text, thirdOption }: FakeFormProps) {
  const [chosenOption, setChosenOption] = useState<null | 0 | 1 | 2>(null);
  const [onlyPreferredLang, setOnlyPreferredLang] = useState(true);

  return (
    <div className={styles.fakeForm}>
      <p>{text}</p>
      <div className={styles.options}>
        <div className={styles.option} onClick={() => setChosenOption(0)}>
          <div className={styles.circleOutside}>
            {chosenOption === 0 && <div className={styles.circleInside} />}
          </div>
          <p>No</p>
        </div>
        <div className={styles.option} onClick={() => setChosenOption(1)}>
          <div className={styles.circleOutside}>
            {chosenOption === 1 && <div className={styles.circleInside} />}
          </div>
          <p>Yes</p>
        </div>
        <div className={styles.option} onClick={() => setChosenOption(2)}>
          <div className={styles.circleOutside}>
            {chosenOption === 2 && <div className={styles.circleInside} />}
          </div>
          <p>{thirdOption}</p>
        </div>
      </div>
      <div
        className={styles.option}
        onClick={() => setOnlyPreferredLang(!onlyPreferredLang)}
      >
        <div className={styles.squareOutside}>
          {onlyPreferredLang && <div className={styles.squareInside} />}
        </div>
        <p>Only posts in my preferred language</p>
      </div>
    </div>
  );
}
