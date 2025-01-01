<script lang="ts">
  let {
    currentTimestamp,
    currentTitle,
    handlePlay,
    handleKeydown,
    addChapter,
  } = $props();
</script>

<div id="add">
  <button id="current-timestamp" onclick={handlePlay}>{currentTimestamp}</button
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

<style>
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
      width: 110px;
      font-weight: 450;
      flex-shrink: 0;
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
</style>
