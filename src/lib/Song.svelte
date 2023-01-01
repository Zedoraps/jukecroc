<script lang="ts">
    import {onMount} from "svelte";
    import {currentUser, pb} from "$lib/pocketbase";
    import Likes from "$lib/Likes.svelte";
    import {isYoutubeUri} from "$lib/uri-helper";

    export let uri: string;
    export let id: string;
    export let submitter: string;
    export let title: string;
    export let youtube: boolean;
    export let added: boolean;
    let preview;

    onMount(async () => {
        if (isYoutubeUri(uri)) {
            await fetch("https://noembed.com/embed?url=" + uri)
                .then(value => value.json())
                .then(value => preview = value)
        }
    })


</script>

<article class="no-padding">
    <div class="grid no-space" class:fill={added}>
        <div class="s6 l3 video">
            {#if preview?.html && youtube}
                <div class="middle">
                    {@html preview.html}
                </div>
            {/if}
            {#if preview?.html && !youtube}
                <div class="middle">
                    <img class="responsive small" src="{preview.thumbnail_url}">
                </div>
            {/if}
        </div>
        <div class="s6 l9">
            <div class="padding">

                {#if title}
                    <h5>{title}</h5>
                {/if}
                {#if submitter}
                    <p>Song vo {submitter}</p>
                {/if}
                {#if $currentUser?.whitelisted && !added}
                    <Likes videoId={id}></Likes>
                {/if}
                {#if added}
                    Dä song esch hinzuegfüegt worde!
                {/if}
            </div>
        </div>
    </div>
</article>

<style>
    .video {
        min-height: 180px;
    }
</style>