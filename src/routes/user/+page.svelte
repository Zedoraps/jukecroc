<script>
    import {currentUser, likes, pb} from "$lib/pocketbase";
    import {onMount} from "svelte";

    let error;
    let username;

    onMount(() => {
        currentUser.subscribe(value => {
            username = value.username;
        })
    })

    async function update() {
        error = undefined;
        try {
            await pb.collection('users').update($currentUser.id, {username})
            error = "erledigt!"
        } catch (err) {
            error = err;
        }
    }
</script>

{#if $currentUser}
    <form method="post" on:submit|preventDefault>
        <label>
            Username:
            <input type="text" name="username" bind:value={username} minlength="3">
        </label>
        {#if error}
            <div class="error">
                <h4>{error}</h4>
            </div>
        {/if}
        <button type="submit" on:click={update}>
            Update
        </button>
    </form>
{:else}
    am lade
{/if}

<style>
    form {
        display: grid;
        gap: 1rem;
    }
</style>
