import { mount } from "svelte";
import Chapters from "../components/Chapters.svelte";

// Content scripts
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/

// Some global styles on the page
import "./styles.css";

// Some svelte component on the page
mount(Chapters, { target: document.body });
