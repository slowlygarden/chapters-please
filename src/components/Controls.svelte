<script lang="ts">
  import Clear from "./icons/Clear.svelte";
  import Copy from "./icons/Copy.svelte";
  import FastForward from "./icons/FastForward.svelte";
  import Playback from "./icons/Playback.svelte";
  import Rewind from "./icons/Rewind.svelte";

  const {
    copyChapters,
    handleRewind,
    handlePlay,
    handleForward,
    sortChapters,
    isPlaying,
  } = $props();
</script>

<div id="controls">
  <button id="copy" aria-label="Copy" onclick={copyChapters}>
    <Copy />
  </button>
  <div id="playback">
    <button id="rewind" aria-label="Rewind" onclick={handleRewind}>
      <Rewind />
    </button>
    <button id="play" aria-label="Play" onclick={handlePlay}>
      <Playback {isPlaying} />
    </button>
    <button id="forward" aria-label="Forward" onclick={handleForward}>
      <FastForward />
    </button>
  </div>
  <button id="clear" aria-label="Clear chapters" onclick={sortChapters}>
    <Clear />
  </button>
</div>

<style>
  #controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;

    #copy,
    #clear,
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
</style>
