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
                if(preview?.error){
                    previewError = "Das Video esch ned gfonde worde"
                }else{
                    title = preview?.title;
                }
                loading = false;

            }else{
                preview = null;
                loading = false;
            }
        } else {
            preview = null;
            loading = false;
        }
    }

</script>

<h1>Song zo de JukeCroc hinzuefüege</h1>
{#if $currentUser?.whitelisted}
    <form method="post" on:submit|preventDefault>
        <label on:input={setPreviewUri}>
            Youtube URI 🎬:
            <input type="url" name="uri" bind:value={uri}>
        </label>
        <label>
            Titel:
            {#if loading}
                <span class="loading">Luege grad nache wie das Lied heisst</span>
                {:else if previewError}
                <span class="loading">{previewError}</span>
                {:else }
                <input type="text" name="title" bind:value={title} disabled="{!preview || previewError}">
                    {/if}
        </label>
        {#if error}
            <div class="error">
                <h4>{error}</h4>
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


<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        display: flex;
        flex-direction: column;
    }

    input {
        height: 1.5rem;
    }

    .loading {
        font-size: 0.9rem;
        padding: 6px 12px;
    }

</style>