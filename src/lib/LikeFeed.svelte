<script>
    import {onDestroy, onMount} from "svelte";
    import {likes, pb} from "$lib/pocketbase";

    let unsubscribeLikes;
    let text;

    async function displayEvent(action, record) {
        const submitter = await pb.collection('users').getOne(record.user);
        const video = await pb.collection('videos').getOne(record.video);
        if (action === 'create') {
            text = `👍 De ${submitter.username} findest Video "${video.title}" geil`
        } else {
            text = `👎 De ${submitter.username} findest Video "${video.title}"  nömme so geil`
        }

        setTimeout(function() { text = undefined }, 5000);
    }

    onMount(async () => {
        unsubscribeLikes = await pb
            .collection('likes')
            .subscribe('*', async ({action, record}) => {
                if (action === 'create') {
                    likes.set([...$likes, record]);
                }
                if (action === 'delete') {
                    likes.set($likes.filter((m) => m.id !== record.id));
                }
                await displayEvent(action, record)
            });
    });


    onDestroy(() => {
        unsubscribeLikes?.();
    });
</script>

<div>
    {#if text}

        <p>{text}<span on:click={() => text = undefined}>x</span></p>
    {/if}
</div>

<style>
    div {
        z-index: 1;
        position: fixed;
        bottom: 0;
        box-sizing: border-box;
        width: min(70ch, calc(100% - 2.5rem));
        background-color: rgba(112, 102, 102, 0.95);
        margin-right: 1rem;
    }

    p {
        margin: 0.3rem 0 0 1rem;
        color: white;
    }
    span {
        cursor: pointer;
        padding: .3rem;
        float: right;
        margin-top: -1rem;
    }
</style>
