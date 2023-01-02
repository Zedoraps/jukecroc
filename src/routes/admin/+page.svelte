<script>
    import {currentUser, likes, loadVideosBySort, pb, videos} from "$lib/pocketbase";
    import {onMount} from "svelte";

    let users = [];

    onMount(async () => {
        loadVideosBySort("-created", true)
        await loadUsers();
    })

    async function loadUsers() {
        await pb.collection("users").getFullList().then(result => {
            users = result;
        })
    }


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

    function added(id, b) {
        pb.collection("videos").update(id, {
            "added": b,
        });
    }
</script>

{#if $currentUser?.admin}
    <h1>Admin</h1>
    <h2>Videos</h2>
    <table class="border medium-space scroll">
        <thead>
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Uri</th>
            <th>Submitter</th>
            <th>Likes</th>
            <th>Actions</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        {#each $videos as video (video.id)}
            <tr>
                <td>{video.id}</td>
                <td>{video.title}</td>
                <td>{video.uri}</td>
                <td>{video.expand?.submitter?.username}</td>
                <td>{$likes?.filter(like => like.video === video.id)?.length}</td>
                {#if video.added}
                    <td>
                        <nav class="right-align">
                            <button class="none" on:click={added(video.id, false)}>Remove from added</button>
                        </nav>
                    </td>
                {:else }
                    <td>
                        <nav class="right-align">
                            <button class="none" on:click={added(video.id, true)}>Mark as Added</button>
                        </nav>
                    </td>
                {/if}
                <td>
                    <nav class="right-align">
                        <button class="none" on:click={deleteVideo(video.id)}>Lösche</button>
                    </nav>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>

    <h2>Users</h2>
    <button on:click={loadUsers}>Refresh</button>
    <table class="border medium-space scroll">
        <thead>
        <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Likes</th>
            <th>Videos</th>
            <th>Created</th>
            <th>Whitelist</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {#each users as user (user.id)}
            <tr>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{$likes?.filter(like => like.user === user.id)?.length}</td>
                <td>{$videos?.filter(video => video.submitter === user.id)?.length}</td>
                <td>{user.created}</td>

                <td>
                    {#if user.whitelisted}
                        <button class="none" on:click={whitelist(user.id, false)}>Un-Whitelist</button>
                    {:else}
                        <button class="none" on:click={whitelist(user.id, true)}>Whitelist</button>
                    {/if}
                </td>

                <td>
                    <button class="none" on:click={deleteUser(user.id)}>Lösche</button>
                </td>
        {/each}
        </tbody>
    </table>
{:else }
    <h1>Du komst hier nicht rein!</h1>
{/if}

<style>
    table {
        display: block;
    }
</style>