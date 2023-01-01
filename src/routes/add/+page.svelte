<script lang="ts">
    import {pb, currentUser} from "$lib/pocketbase";
    import {ClientResponseError} from "pocketbase";
    import {goto} from "$app/navigation";
    import {isYoutubeUri} from "$lib/uri-helper";

    let uri: string;
    let startTime = 0;
    let error;
    let previewError;
    let createdVideo;
    let preview;
    let loading = false;
    let title;


    async function add() {
        error = null;
        createdVideo = null;
        try {
            const data = {
                uri: uri,
                starttime: startTime,
                title: title,
                submitter: $currentUser?.id
            };
            createdVideo = await pb.collection('videos').create(data)
            console.log(createdVideo)
            uri = "";
            startTime = 0;
            preview = null;
            goto(`/`)
        } catch (err) {
            error = err as ClientResponseError
            console.log(error.data)
        }
    }

    async function setPreviewUri() {
        if (uri?.length > 10) {
            title = undefined;
            previewError = undefined;
            error = undefined;
            if (isYoutubeUri(uri)) {
                loading = true;
                await fetch("https://noembed.com/embed?url=" + uri)
                    .then(value => value.json())
                    .then(value => preview = value)
                if (preview?.error) {
                    previewError = "Das Video esch ned gfonde worde"
                } else {
                    title = preview?.title;
                }
                loading = false;

            } else {
                preview = null;
                loading = false;
            }
        } else {
            preview = null;
            loading = false;
            title = null;
        }
    }

</script>

<h4>Song zo de JukeCroc hinzuefüege</h4>
<br>
{#if $currentUser?.whitelisted}
    <form method="post" on:submit|preventDefault>


        <p>Youtube URI 🎬</p>
        <div class="field prefix large border" class:invalid="{previewError}">
            <i>search</i>
            <input type="url" name="uri" bind:value={uri} on:input={setPreviewUri}>
            {#if previewError}
                <span class="error">Das Video hani ned chöne fende </span>
            {/if}
        </div>
        <p>Titel</p>
        {#if loading}
            <div class="field prefix large border">
                <a class="loader"></a>
                <input type="text">
            </div>
        {:else }
            <div class="field prefix large border">
                <i>drive_file_rename_outline</i>
                <input type="text" bind:value={title} disabled="{!preview || previewError}">
            </div>
        {/if}

        {#if error}
            <div class="toast red white-text active">
                <i>error</i>
                <span>{error}</span>
            </div>
        {/if}
        <button type="submit" on:click={add} disabled="{previewError || !title || !uri}">
            Hinzuefüege
        </button>
    </form>
{:else }
    <p>
        Du dafsch ned neui songs hinzuefüge ⛔ <br>
        wart bes du vom Ö d'Erlaubnis becho häsch!
    </p>
{/if}
