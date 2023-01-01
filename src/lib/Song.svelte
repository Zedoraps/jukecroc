<script lang="ts">
    import { onMount} from "svelte";
    import {currentUser, pb} from "$lib/pocketbase";
    import Likes from "$lib/Likes.svelte";
    import {isYoutubeUri} from "$lib/uri-helper";

    export let uri: string;
    export let id: string;
    export let submitter: string;
    export let title: string;
    export let deleting = false;
    let preview;

    onMount(async () => {
        if (isYoutubeUri(uri)) {
            await fetch("https://noembed.com/embed?url=" + uri)
                .then(value => value.json())
                .then(value => preview = value)
        }
    })


</script>

<div class="song">


    {#if title}
        <h2>{title}</h2>
    {/if}
    <div class="content">
        {#if preview?.html}
            <div class="video">
                {@html preview.html}
            </div>
        {/if}
        <div class="metadata">
            {#if submitter}
                <span>Song von {submitter}</span>
            {/if}


            {#if $currentUser?.whitelisted}
                <Likes videoId={id}></Likes>
            {/if}

        </div>
    </div>
</div>

<style>
    h2 {
        font-size: 1.2rem;
        margin: 0;
    }

    .song {
        background-color: rgba(61, 80, 225, 0.44);
        padding: 0.5rem;
        margin: 0.8rem;
        border-radius: 2px;
        box-shadow: 10px 8px 0px var(--accent);
        min-height: 200px;
    }

    .content {
        display: grid;
        grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
        justify-items: center;

    }

    .video {
        width: 200px;
        height: 113px;
    }

    .metadata {
        width: 100%;
    }

</style>