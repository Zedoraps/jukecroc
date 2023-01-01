<script>
    import { videos} from "$lib/pocketbase";
    import Song from "$lib/Song.svelte";
</script>

<h1>Willkomme be JukeCroc</h1>

{#each $videos as video (video.id)}
    <Song uri={video.uri} submitter={video.expand?.submitter?.username} id={video.id} title="{video.title}"></Song>
{/each}


