<script>
    import {videos} from "$lib/pocketbase";
    import Song from "$lib/Song.svelte";
    import {loadVideosBySort} from "$lib/pocketbase";

    let sort = [
        {text: `👶 Neuste zerscht`, sort: "-created"},
        {text: `👴 Eltischti zerscht`, sort: "created"},
    ];
    let selected;
    let added = false;
    let youtube = false;
</script>

<h4>Jukecroc</h4>
<div class="filters">
    <div>
        <div class="field suffix border">
            <select bind:value={selected} on:change={() => loadVideosBySort(selected.sort, added)}>
                {#each sort as question}
                    <option value={question}>
                        {question.text}
                    </option>
                {/each}
            </select>
            <i>arrow_drop_down</i>
        </div>
    </div>
    <div>
        <label class="switch">
            <input type="checkbox" bind:checked={added} on:change={() => loadVideosBySort(selected.sort, added)}>
            <span>
                <i>cloud_download</i>
            </span>
            <span class="l switch-text">Hinzuegfüegti azeige?</span>
        </label>
        <div class="s m tooltip bottom">Hinzuegfüegti azeige?</div>
    </div>

    <div>
        <label class="switch">
            <input type="checkbox" bind:checked={youtube}>
            <span>
                <i>movie</i>
            </span>
            <span class="l switch-text">Youtube Videos azeige?</span>
        </label>
        <div class="s m tooltip bottom">Youtube Videos azeige?</div>
    </div>
</div>
{#each $videos as video (video.id)}
    <Song uri={video.uri} submitter={video.expand?.submitter?.username} id={video.id} title="{video.title}"
          youtube={youtube} added="{video.added}"></Song>
{/each}


<style>
    .filters {
        display: flex;
        align-items: start;
        padding-top: 30px;
        gap: 20px;
        flex-wrap: wrap;
    }

    .switch-text {
        padding: 10px;
    }
</style>

