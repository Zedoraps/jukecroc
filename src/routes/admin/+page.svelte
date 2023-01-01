<script>
    import {currentUser, pb, videos} from "$lib/pocketbase";
    import Song from "$lib/Song.svelte";

    let users = [];

    async function loadUsers() {
        await pb.collection("users").getFullList().then(result => {
            users = result;
        })
    }

    loadUsers()

    async function whitelist(id, value) {
        await pb.collection("users").update(id, {"whitelisted": value})
        await loadUsers()
    }

    async function deleteUser(id) {
        if (confirm("Sure?")) {
            await pb.collection("users").delete(id)
            await loadUsers()
        }
    }

    function deleteVideo(id) {
        if (confirm("Sure?")) {
            pb.collection("videos").delete(id);
        }
    }
</script>

{#if $currentUser?.admin}
    <h1>Admin</h1>
    <h2>Videos</h2>
    {#each $videos as video (video.id)}
        <div>
            <Song submitter={video.expand?.submitter?.username} id={video.id} title="{video.title}"></Song>
            <button on:click={deleteVideo(video.id)}>Lösche</button>
        </div>
    {/each}
    <h2>Users</h2>
    <button on:click={loadUsers}>Refresh</button>
    {#each users as user (user.id)}
        <div class="users">
            <p>{user.username}</p>
            {#if user.whitelisted}
                <button on:click={whitelist(user.id, false)}>Un-Whitelist</button>
            {:else}
                <button on:click={whitelist(user.id, true)}>Whitelist</button>
            {/if}
            <button on:click={deleteUser(user.id)}>Lösche</button>
        </div>
    {/each}
{:else }
    <h1>Du komst hier nicht rein!</h1>
{/if}

<style>
    .users {
        border: 1px black solid;
        margin: 0.3rem;
        padding: 0.5rem;
    }

    p {
        margin: 0.3rem;
    }
</style>