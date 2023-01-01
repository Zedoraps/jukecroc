<script>
    import {videos} from "$lib/pocketbase";
    import Song from "$lib/Song.svelte";
    import {loadVideosBySort} from "$lib/pocketbase";

    let sort = [
        {text: `👶 Neuste zerscht`, sort: "-created"},
        {text: `👴 Eltischti zerscht`, sort: "created"},
    ];
    let selected;
</script>

<h4>Jukecroc</h4>
<div class="field middle-align">

    <div class="field suffix border">
        <select bind:value={selected} on:change={() => loadVideosBySort(selected.sort)}>
            {#each sort as question}
                <option value={question}>
                    {question.text}
                </option>
            {/each}
        </select>
        <i>arrow_drop_down</i>
    </div>
</div>
{#each $videos as video (video.id)}
    <Song uri={video.uri} submitter={video.expand?.submitter?.username} id={video.id} title="{video.title}"></Song>
{/each}


