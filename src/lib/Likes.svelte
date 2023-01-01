<script>
    import {currentUser, likes, pb} from "$lib/pocketbase";
    import {onDestroy} from "svelte";
    export let videoId;
    let liking = false;
    let likedId = $likes?.find(current => current.video === videoId && current.user === $currentUser.id)?.id

    let unsub = likes.subscribe((value) => {
        likedId = value?.find(current => current.video === videoId && current.user === $currentUser.id)?.id;
    })

    onDestroy(() => {
        unsub?.();
    })

    async function like() {
        liking = true;
        try {
            const data = {
                user: $currentUser?.id,
                video: videoId,
            };
            await pb.collection('likes').create(data)
        } catch (err) {
            console.log(err)
            alert(err)
        }
        liking = false;
    }

    async function removeLike() {
        liking = true;
        try {
            await pb.collection('likes').delete(likedId)
        } catch (err) {
            console.log(err)
            alert(err)
        }
        liking = false;
    }

</script>

<div>
    <span>Pönkt:</span>
    <span class="likes">{$likes?.filter(like => like.video === videoId)?.length}</span>
    {#if liking}
        <button disabled>🚫</button>
    {:else if $likes?.find(current => current.video === videoId && current.user === $currentUser.id)}
        <button class="inactive" on:click={removeLike}>Nömme so geil 💩</button>
    {:else}
        <button on:click={like}>Geil 😎</button>
    {/if          }
</div>

<style>

    .likes {
        padding: 1rem;
        margin: 0.3rem;
    }
</style>