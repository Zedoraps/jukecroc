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

    <h4>Profil bearbeite</h4>
    <br>
    <form method="post" on:submit|preventDefault>
        <div class="field label prefix large border">
            <i>badge</i>
            <input type="text" name="username" bind:value={username} minlength="3">
        </div>
        {#if error}
            <div class="toast red white-text active">
                <i>error</i>
                <span>{error}</span>
            </div>
        {/if}
        <button type="submit" on:click={update}>
            Update
        </button>
    </form>
{:else}
    am lade
{/if}
