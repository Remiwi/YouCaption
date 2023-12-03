"use client";

import styles from "./page.module.css";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FollowTable from "@/components/FollowTable/FollowTable";
import SubscriptionTable from "@/components/SubscriptionTable/SubscriptionTable";

import { fetchGet, fetchPost, fetchPostJSON } from "@/utilities/myFetch";

type NotifSettings = {
  getNotifs: 0 | 1 | 2 | null;
  onlyLangMatch: boolean;
};

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
    queryKey: ["followList"],
    queryFn: () =>
      fetchGet("http://127.0.0.1:8000/followingList").then((res) => res.json()),
  });
  const following = followQuery.isSuccess ? followQuery.data.followingList : [];

  // Get subscription list
  const savedQuery = useQuery({
    queryKey: ["saved"],
    queryFn: () =>
      fetchGet("http://127.0.0.1:8000/savedVideoList").then((res) =>
        res.json()
      ),
  });
  const savedVideos = savedQuery.isSuccess ? savedQuery.data.savedList : [];

  // Get notification settings
  const [followingNotifState, setFollowingNotifState] = useState<NotifSettings>(
    {
      getNotifs: null,
      onlyLangMatch: false,
    }
  );
  const followingNotifQuery = useQuery({
    queryKey: ["followingNotifSettings"],
    queryFn: () =>
      fetchGet("http://127.0.0.1:8000/followingNotifSettings").then((res) =>
        res.json()
      ),
  });
  if (followingNotifQuery.isSuccess && followingNotifState.getNotifs === null) {
    setFollowingNotifState(followingNotifQuery.data);
  }
  const followingNotifMutation = useMutation({
    mutationKey: ["followingNotifSettings"],
    mutationFn: (settings: NotifSettings) =>
      fetchPostJSON("http://127.0.0.1:8000/updateFollowingNotifSettings", {
        body: JSON.stringify(settings),
      }),
  });

  const [videoNotifState, setVideoNotifState] = useState<NotifSettings>({
    getNotifs: null,
    onlyLangMatch: false,
  });
  const videoNotifQuery = useQuery({
    queryKey: ["videoNotifSettings"],
    queryFn: () =>
      fetchGet("http://127.0.0.1:8000/videoNotifSettings").then((res) =>
        res.json()
      ),
  });
  if (videoNotifQuery.isSuccess && videoNotifState.getNotifs === null) {
    setVideoNotifState(videoNotifQuery.data);
  }
  const videoNotifMutation = useMutation({
    mutationKey: ["videoNotifSettings"],
    mutationFn: (settings: NotifSettings) =>
      fetchPostJSON("http://127.0.0.1:8000/updateVideoNotifSettings", {
        body: JSON.stringify(settings),
      }),
  });

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
        <FollowTable users={following} />
        <FakeForm
          text="Get notified when an author you follow publishes?"
          thirdOptionText="Only for videos I've saved"
          state={followingNotifState}
          setState={setFollowingNotifState}
        />
        <SubscriptionTable videos={savedVideos} />
        <FakeForm
          text="Get notified when a saved video gets a new post?"
          thirdOptionText="Only from authors I follow"
          state={videoNotifState}
          setState={setVideoNotifState}
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
              if (followingNotifState.getNotifs !== null) {
                followingNotifMutation.mutate(followingNotifState);
              }
              if (videoNotifState.getNotifs !== null) {
                videoNotifMutation.mutate(videoNotifState);
              }
              setTimeout(() => window.location.reload(), 500);
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
  thirdOptionText: string;
  state: NotifSettings;
  setState: (state: NotifSettings) => void;
};

function FakeForm({ text, thirdOptionText, state, setState }: FakeFormProps) {
  return (
    <div className={styles.fakeForm}>
      <p>{text}</p>
      <div className={styles.options}>
        <div
          className={styles.option}
          onClick={() =>
            setState({
              getNotifs: 0,
              onlyLangMatch: state.onlyLangMatch,
            })
          }
        >
          <div className={styles.circleOutside}>
            {state.getNotifs === 0 && <div className={styles.circleInside} />}
          </div>
          <p>No</p>
        </div>
        <div
          className={styles.option}
          onClick={() =>
            setState({
              getNotifs: 1,
              onlyLangMatch: state.onlyLangMatch,
            })
          }
        >
          <div className={styles.circleOutside}>
            {state.getNotifs === 1 && <div className={styles.circleInside} />}
          </div>
          <p>Yes</p>
        </div>
        <div
          className={styles.option}
          onClick={() =>
            setState({
              getNotifs: 2,
              onlyLangMatch: state.onlyLangMatch,
            })
          }
        >
          <div className={styles.circleOutside}>
            {state.getNotifs === 2 && <div className={styles.circleInside} />}
          </div>
          <p>{thirdOptionText}</p>
        </div>
      </div>
      <div
        className={styles.option}
        onClick={() =>
          setState({
            getNotifs: state.getNotifs,
            onlyLangMatch: !state.onlyLangMatch,
          })
        }
      >
        <div className={styles.squareOutside}>
          {state.onlyLangMatch && <div className={styles.squareInside} />}
        </div>
        <p>Only posts in my preferred language</p>
      </div>
    </div>
  );
}
