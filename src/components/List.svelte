<script lang="ts">
  const {
    chapters,
    handleSeek,
    setIsEditing,
    handleKeydownEdit,
    deleteChapter,
  } = $props();
</script>

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
          onfocus={() => setIsEditing(true)}
          onblur={() => setIsEditing(false)}
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

<style>
  #chapters {
    display: flex;
    flex-direction: column;
    justify-content: end;
    gap: 8px;
    min-height: 140px;
    min-height: 430px;
    overflow-y: scroll;
  }

  .chapter {
    display: flex;
    gap: 8px;

    > * {
      background: #282726;
      border-radius: 8px;
      border: 1px solid #343331;
    }

    .timestamp {
      height: 40px;
      width: 110px;

      flex-shrink: 0;
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
</style>
