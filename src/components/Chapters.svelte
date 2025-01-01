<script lang="ts">
  import { onMount } from "svelte";
  import { chapters } from "../store";
  import List from "./List.svelte";
  import Controls from "./Controls.svelte";
  import Add from "./Add.svelte";

  let isEditing = $state(false);
  let video: HTMLVideoElement | null = null;
  let currentTimestamp = $state("00:00:00");
  let currentTitle = $state("");
  let isPlaying = $state(false);
  let newChapterTimestamp: string | null = $state(null);

  function deleteChapter(i: number) {
    $chapters = $chapters.filter((_, index) => index !== i);
  }

  function setIsEditing(value: boolean) {
    isEditing = value;
  }

  function sortChapters() {
    $chapters = $chapters.slice().sort((a, b) => {
      const timeA = a.timestamp
        .split(":")
        .reduce((acc: number, time: string) => 60 * acc + parseInt(time), 0);
      const timeB = b.timestamp
        .split(":")
        .reduce((acc: number, time: string) => 60 * acc + parseInt(time), 0);
      return timeA - timeB;
    });
  }

  function addChapter() {
    const newChapter = {
      timestamp: currentTimestamp,
      title: currentTitle,
    };
    $chapters = [...$chapters, newChapter];

    currentTitle = "";
    sortChapters();

    newChapterTimestamp = newChapter.timestamp;
  }

  function copyChapters() {
    sortChapters();
    const chaptersText = $chapters
      .map((chapter) => `${chapter.timestamp} ${chapter.title}`)
      .join("\n");
    navigator.clipboard
      .writeText(chaptersText)
      .then(() => {
        console.log("Chapters copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy chapters: ", err);
      });
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      currentTitle = "";
    } else if (event.key === "Enter") {
      addChapter();
    }
  }

  function handleKeydownEdit(event: KeyboardEvent) {
    if ((event && event.key === "Escape") || event.key === "Enter") {
      if (event.target) {
        (event.target as HTMLElement).blur();
      }
    }
  }

  function getCurrentTime() {
    if (video) {
      const currentTime = video.currentTime;
      const hours = Math.floor(currentTime / 3600);
      const minutes = Math.floor((currentTime % 3600) / 60);
      const seconds = Math.floor(currentTime % 60);
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return "00:00:00";
  }

  function handlePlay() {
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  }

  function handleRewind() {
    if (video) {
      if (video.currentTime > 10) {
        video.currentTime -= 10;
      } else {
        video.currentTime = 0;
      }
    }
  }

  function handleForward() {
    if (video) {
      if (video.currentTime < video.duration - 10) {
        video.currentTime += 10;
      } else {
        video.currentTime = video.duration;
      }
    }
  }

  function handleSeek(timestamp: string) {
    if (video) {
      const [hours, minutes, seconds] = timestamp.split(":").map(Number);
      const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
      video.currentTime = timeInSeconds;
    }
  }

  onMount(() => {
    const updateVideoState = () => {
      currentTimestamp = getCurrentTime();
      isPlaying = video ? !video.paused : false;
    };

    video = document.querySelector("video");

    if (!video) {
      const interval = setInterval(() => {
        video = document.querySelector("video");
        if (video) {
          clearInterval(interval);
          updateVideoState();
          video.addEventListener("timeupdate", () => {
            currentTimestamp = getCurrentTime();
          });
          video.addEventListener("play", () => {
            isPlaying = true;
          });
          video.addEventListener("pause", () => {
            isPlaying = false;
          });
        }
      }, 1000);
    } else {
      updateVideoState();
      video.addEventListener("timeupdate", () => {
        currentTimestamp = getCurrentTime();
      });
      video.addEventListener("play", () => {
        isPlaying = true;
      });
      video.addEventListener("pause", () => {
        isPlaying = false;
      });
    }
  });

  $effect(() => {
    if (newChapterTimestamp) {
      console.log("hekki");
      const newChapterElement = document.getElementById(newChapterTimestamp);
      if (newChapterElement) {
        newChapterElement.scrollIntoView({ behavior: "smooth" });
        newChapterTimestamp = null;
      }
    }
  });

  $inspect(chapters);
</script>

<div id="chapters-please">
  <div id="top">
    <List
      {chapters}
      {handleSeek}
      {setIsEditing}
      {handleKeydownEdit}
      {deleteChapter}
    />

    <div class="note">
      {#if isEditing}
        Chapters are saved as you type!
      {:else if $chapters.length < 3}
        YouTube requires atleast 3 chapters, each atleast 10 secs apart.
      {:else}
        You have {$chapters.length} chapters at the moment.
      {/if}
    </div>
  </div>

  <div id="bottom">
    <Controls
      {copyChapters}
      {handleRewind}
      {handlePlay}
      {handleForward}
      {sortChapters}
      {isPlaying}
    />
    <Add
      {currentTimestamp}
      {currentTitle}
      {handlePlay}
      {handleKeydown}
      {addChapter}
    />
    <div class="note">
      A thing by <a
        href="https://bsky.app/profile/slowly.garden"
        target="_blank">mohan</a
      >, dedicated to
      <a
        href="https://craigmod.com/membership/?ref=chapters-please"
        target="_blank">Special Projects.</a
      >
    </div>
  </div>
</div>

<style>
  #chapters-please {
    width: 460px;
    display: flex;
    flex-direction: column;
    gap: 42px;

    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 9999999;

    background: #1c1b1a;
    border: 1px solid #343331;
    border-radius: 16px;
    padding: 16px;
  }

  .note {
    font-size: 12px;
    text-align: center;
    color: #6f6e68;
    margin-top: 14px;
  }
</style>
