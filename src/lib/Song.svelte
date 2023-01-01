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

<article class="no-padding">
    <div class="grid no-space">
        <div class="s6 l3">
            {#if preview?.html}
                <div class="middle">
                    {@html preview.html}
                </div>
            {/if}
        </div>
        <div class="s6 l9">
            <div class="padding">

                {#if title}
                    <h5>{title}</h5>
                {/if}
                    {#if submitter}
                        <p>Song von {submitter}</p>
                    {/if}
                    {#if $currentUser?.whitelisted}
                        <Likes videoId={id}></Likes>
                    {/if}
            </div>
        </div>
    </div>
</article>

<div class="song">



    <div class="content">


    </div>
</div>
