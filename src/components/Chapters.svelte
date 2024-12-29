<script lang="ts">
  import { onMount } from "svelte";
  import { chapters } from "../store";

  let isEditing = $state(false);
  let video: HTMLVideoElement | null = null;
  let currentTimestamp = $state("00:00:00");
  let currentTitle = $state("");
  let isPlaying = $state(false);
  let newChapterTimestamp: string | null = $state(null);

  function deleteChapter(i: number) {
    $chapters = $chapters.filter((_, index) => index !== i);
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

    // Store the timestamp of the newly added chapter
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

  // Reactive statement to scroll to the newly added chapter
  $effect(() => {
    if (newChapterTimestamp) {
      console.log("hekki");
      const newChapterElement = document.getElementById(newChapterTimestamp);
      if (newChapterElement) {
        newChapterElement.scrollIntoView({ behavior: "smooth" });
        newChapterTimestamp = null; // Reset the variable after scrolling
      }
    }
  });

  $inspect(chapters);
</script>

<div id="chapters-please">
  <div id="top">
    <div id="chapters">
      {#each $chapters as chapter, i}
        <div class="chapter" id={chapter.timestamp}>
          <button
            class="timestamp"
            onclick={() => {
              handleSeek(chapter.timestamp);
            }}>{chapter.timestamp}</button
          >
          <div class="title">
            <input
              class="add-title"
              placeholder={i == 0 ? "Required" : "Add a title"}
              bind:value={chapter.title}
              onfocus={() => (isEditing = true)}
              onblur={() => (isEditing = false)}
              onkeydown={(e) => handleKeydownEdit(e)}
            />
            <button
              class="remove-button"
              aria-label="Remove"
              onclick={() => i !== 0 && deleteChapter(i)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {#if i !== 0}
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.99112 5.99112C6.47928 5.50296 7.27073 5.50296 7.75889 5.99112L10 8.23224L12.2411 5.99112C12.7293 5.50296 13.5208 5.50296 14.0089 5.99112C14.497 6.47928 14.497 7.27073 14.0089 7.75889L11.7678 10L14.0089 12.2411C14.497 12.7293 14.497 13.5208 14.0089 14.0089C13.5208 14.497 12.7293 14.497 12.2411 14.0089L10 11.7678L7.75889 14.0089C7.27073 14.497 6.47928 14.497 5.99112 14.0089C5.50296 13.5208 5.50296 12.7293 5.99112 12.2411L8.23224 10L5.99112 7.75889C5.50296 7.27073 5.50296 6.47928 5.99112 5.99112Z"
                    fill="#87857F"
                  />
                {:else}
                  <path
                    d="M9.50017 5V15M5.0004 7.5L14 12.5M5 12.5L13.9996 7.5"
                    stroke="#87857F"
                    stroke-width="2.5"
                    stroke-linecap="round"
                  />
                {/if}
              </svg>
            </button>
          </div>
        </div>
      {/each}
    </div>
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
    <div id="controls">
      <button id="copy" aria-label="Copy" onclick={copyChapters}
        ><svg
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.875 3.95833H13.4584C14.3328 3.95833 15.0417 4.66722 15.0417 5.54167V15.0417C15.0417 15.9161 14.3328 16.625 13.4584 16.625H5.54171C4.66726 16.625 3.95837 15.9161 3.95837 15.0417V5.54167C3.95837 4.66722 4.66726 3.95833 5.54171 3.95833H7.12504M11.875 3.95833V5.54167H7.12504V3.95833M11.875 3.95833C11.875 3.08388 11.1662 2.375 10.2917 2.375H8.70837C7.83392 2.375 7.12504 3.08388 7.12504 3.95833"
            stroke="#E6E4D9"
            stroke-width="1.58333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <div id="playback">
        <button id="rewind" aria-label="Rewind" onclick={handleRewind}
          ><svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.79897 8.33333C3.81173 8.33367 3.82447 8.33367 3.83719 8.33333H6.66667C7.1269 8.33333 7.5 7.96023 7.5 7.5C7.5 7.03977 7.1269 6.66667 6.66667 6.66667H5.21245C6.26708 5.15472 8.01902 4.16667 10.0004 4.16667C12.4472 4.16667 14.5441 5.67335 15.4101 7.81268C15.5827 8.23929 16.0686 8.44517 16.4952 8.27245C16.9218 8.09976 17.1277 7.61393 16.9549 7.18732C15.843 4.44027 13.1492 2.5 10.0004 2.5C7.64325 2.5 5.54114 3.58728 4.16667 5.28635V4.16667C4.16667 3.70643 3.79357 3.33333 3.33333 3.33333C2.8731 3.33333 2.5 3.70643 2.5 4.16667V7.5C2.5 7.96023 2.8731 8.33333 3.33333 8.33333H3.79897Z"
              fill="white"
            />
            <path
              d="M6.18823 16.6378V11.8823H6.16707L5.61166 12.2579C5.33659 12.4324 5.18847 12.4854 5.01391 12.4854C4.6648 12.4854 4.41089 12.2314 4.41089 11.8823C4.41089 11.6232 4.56958 11.3904 4.88167 11.1947L5.7439 10.6181C6.1565 10.3536 6.53206 10.2319 6.88647 10.2319C7.50537 10.2319 7.91796 10.6499 7.91796 11.2952V16.6378C7.91796 17.2355 7.60587 17.5688 7.05575 17.5688C6.50032 17.5688 6.18823 17.2303 6.18823 16.6378Z"
              fill="white"
            />
            <path
              d="M8.98633 14.0882V13.702C8.98633 11.5491 10.0919 10.1473 11.8692 10.1473C13.6518 10.1473 14.7151 11.5226 14.7151 13.702V14.0882C14.7151 16.2358 13.5989 17.6587 11.8322 17.6587C10.0654 17.6587 8.98633 16.2675 8.98633 14.0882ZM10.7425 13.7073V14.0828C10.7425 15.4582 11.1551 16.2622 11.8533 16.2622C12.5463 16.2622 12.9642 15.4529 12.9642 14.0828V13.7073C12.9642 12.3425 12.5463 11.5438 11.8481 11.5438C11.1498 11.5438 10.7425 12.3373 10.7425 13.7073Z"
              fill="white"
            />
          </svg>
        </button>
        <button id="play" aria-label="Play" onclick={handlePlay}
          ><svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {#if isPlaying}
              <path
                d="M4 5.75C4 4.30026 5.17526 3.125 6.625 3.125C8.07474 3.125 9.25 4.30026 9.25 5.75V16.25C9.25 17.6998 8.07474 18.875 6.625 18.875C5.17526 18.875 4 17.6998 4 16.25V5.75Z"
                fill="white"
              />
              <path
                d="M12.75 5.75C12.75 4.30026 13.9252 3.125 15.375 3.125C16.8248 3.125 18 4.30026 18 5.75V16.25C18 17.6998 16.8248 18.875 15.375 18.875C13.9252 18.875 12.75 17.6998 12.75 16.25V5.75Z"
                fill="white"
              />
            {:else}
              <path
                d="M8.87942 2.71698C7.13058 1.63682 4.875 2.8948 4.875 4.95033V17.0498C4.875 19.1053 7.13058 20.3633 8.87942 19.2831L18.6742 13.2334C20.335 12.2076 20.335 9.79245 18.6742 8.76671L8.87942 2.71698Z"
                fill="white"
              />
            {/if}
          </svg>
        </button>
        <button id="forward" aria-label="Forward" onclick={handleForward}
          ><svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.04621 7.18732C4.15819 4.44027 6.85187 2.5 10.0007 2.5C12.3579 2.5 14.46 3.58727 15.8345 5.28635V4.16667C15.8345 3.70643 16.2076 3.33333 16.6678 3.33333C17.1281 3.33333 17.5012 3.70643 17.5012 4.16667V7.5C17.5012 7.96023 17.1281 8.33333 16.6678 8.33333H13.3345C12.8742 8.33333 12.5012 7.96023 12.5012 7.5C12.5012 7.03977 12.8742 6.66667 13.3345 6.66667H14.7887C13.7341 5.15472 11.9822 4.16667 10.0007 4.16667C7.55396 4.16667 5.45709 5.67335 4.59111 7.81268C4.41842 8.23929 3.93259 8.44517 3.50598 8.27245C3.07937 8.09976 2.87352 7.61393 3.04621 7.18732Z"
              fill="white"
            />
            <path
              d="M6.60499 16.6378V11.8823H6.58383L6.0284 12.2579C5.75334 12.4324 5.60523 12.4854 5.43067 12.4854C5.08155 12.4854 4.82764 12.2314 4.82764 11.8823C4.82764 11.6232 4.98633 11.3904 5.29842 11.1947L6.16064 10.6181C6.57324 10.3536 6.94881 10.2319 7.30323 10.2319C7.92212 10.2319 8.3347 10.6499 8.3347 11.2952V16.6378C8.3347 17.2355 8.02263 17.5688 7.4725 17.5688C6.91708 17.5688 6.60499 17.2303 6.60499 16.6378Z"
              fill="white"
            />
            <path
              d="M9.40332 14.0882V13.702C9.40332 11.5491 10.5088 10.1473 12.2862 10.1473C14.0688 10.1473 15.1321 11.5226 15.1321 13.702V14.0882C15.1321 16.2358 14.0159 17.6587 12.2492 17.6587C10.4824 17.6587 9.40332 16.2675 9.40332 14.0882ZM11.1595 13.7073V14.0828C11.1595 15.4582 11.5721 16.2622 12.2703 16.2622C12.9632 16.2622 13.3812 15.4529 13.3812 14.0828V13.7073C13.3812 12.3425 12.9632 11.5438 12.265 11.5438C11.5667 11.5438 11.1595 12.3373 11.1595 13.7073Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
      <button id="sort" aria-label="Sort chapters" onclick={sortChapters}
        ><svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.0013 3.33325C5.46153 3.33325 5.83463 3.70635 5.83463 4.16659V13.8207L6.91055 12.7442C7.2359 12.4187 7.76354 12.4185 8.08906 12.7438C8.41455 13.0692 8.41471 13.5968 8.08938 13.9223L5.5907 16.4223C5.43447 16.5787 5.22253 16.6665 5.00152 16.6666C4.7805 16.6667 4.56852 16.5789 4.4122 16.4227L1.91086 13.9227C1.58534 13.5973 1.5852 13.0697 1.91055 12.7442C2.2359 12.4187 2.76354 12.4185 3.08906 12.7438L4.16796 13.8222V4.16659C4.16796 3.70635 4.54105 3.33325 5.0013 3.33325Z"
            fill="#E6E4D9"
          />
          <path
            d="M9.99996 5C9.53971 5 9.16663 5.3731 9.16663 5.83333C9.16663 6.29357 9.53971 6.66667 9.99996 6.66667H16.6666C17.1269 6.66667 17.5 6.29357 17.5 5.83333C17.5 5.3731 17.1269 5 16.6666 5H9.99996Z"
            fill="#E6E4D9"
          />
          <path
            d="M13.3333 13.3333C12.8731 13.3333 12.5 13.7063 12.5 14.1666C12.5 14.6268 12.8731 14.9999 13.3333 14.9999H16.6667C17.1269 14.9999 17.5 14.6268 17.5 14.1666C17.5 13.7063 17.1269 13.3333 16.6667 13.3333H13.3333Z"
            fill="#E6E4D9"
          />
          <path
            d="M10.8334 10.0001C10.8334 9.53983 11.2065 9.16675 11.6667 9.16675H16.6667C17.127 9.16675 17.5 9.53983 17.5 10.0001C17.5 10.4603 17.127 10.8334 16.6667 10.8334H11.6667C11.2065 10.8334 10.8334 10.4603 10.8334 10.0001Z"
            fill="#E6E4D9"
          />
        </svg>
      </button>
    </div>
    <div id="add">
      <button id="current-timestamp" onclick={handlePlay}
        >{currentTimestamp}</button
      >
      <div id="title">
        <input
          id="add-title"
          placeholder={"Add a chapter"}
          bind:value={currentTitle}
          onkeydown={handleKeydown}
          autocomplete="off"
        />
        <button id="add-button" aria-label="Add" onclick={addChapter}
          ><svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.99992 5.83337V10M9.99992 10V14.1667M9.99992 10H5.83325M9.99992 10H14.1666"
              stroke="#87857F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
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
  @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

  a {
    font-size: 12px;
    color: inherit;
    text-decoration: none;

    &:hover {
      color: #889a39;
    }
  }

  button {
    &:hover {
      opacity: 0.8;
    }
  }

  * {
    font-family: "Inter", serif;
    font-weight: 320;
    font-size: 14px;
    color: #eaeaea;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
  }

  button {
    cursor: pointer;
  }

  input {
    background: none;
  }

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

  #chapters {
    display: flex;
    flex-direction: column;
    gap: 8px;

    max-height: 430px;
    overflow-y: scroll;
  }

  .chapter {
    display: flex;
    gap: 6px;

    > * {
      background: #282726;
      border-radius: 8px;
      border: 1px solid #343331;
    }

    .timestamp {
      height: 40px;
      width: 130px;
    }

    .title {
      height: 40px;
      width: 100%;
      display: flex;
      background: #282726;

      .add-title {
        flex-grow: 1;
        width: max-content;
        height: 100%;
        padding: 12px 4px 12px 16px;
      }

      .remove-button {
        width: 40px;
        flex-shrink: 0;

        display: flex;
        justify-content: center;
        align-items: center;
        background: none;
      }
    }
  }

  #controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;

    #copy,
    #sort,
    #rewind,
    #forward {
      width: 36px;
      height: 36px;
      background: #403e3c;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #playback {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;

      #play {
        width: 48px;
        height: 48px;
        background: #889a39;
        border-radius: 50%;
      }
    }
  }

  #add {
    display: flex;
    gap: 8px;
    margin-top: 24px;

    > * {
      background: #282726;
      border-radius: 8px;
      border: 1px solid #343331;
    }

    #current-timestamp {
      height: 40px;
      width: 130px;
      font-weight: 450;
    }

    #title {
      height: 40px;
      width: 100%;
      display: flex;
      background: #282726;

      #add-title {
        flex-grow: 1;
        width: max-content;
        height: 100%;
        padding: 12px 16px;
      }

      #add-button {
        width: 40px;
        flex-shrink: 0;

        display: flex;
        justify-content: center;
        align-items: center;
        background: none;
      }
    }
  }

  .note {
    font-size: 12px;
    text-align: center;
    color: #6f6e68;
    margin-top: 14px;
  }

  * {
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none; /* Safari and Chrome */
    }
  }
</style>
