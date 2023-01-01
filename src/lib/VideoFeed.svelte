<script>
    import {onDestroy, onMount} from "svelte";
    import {pb, videos} from "$lib/pocketbase";

    let unsubscribe;
    let text;

    async function displayEvent(action, record) {
        const submitter = await pb.collection('users').getOne(record.submitter);
        if (action === 'create') {
            text = `🆕 De ${submitter.username} het s'Video "${record.title}" hinzuegfüegt`
        } else {
            text = `🚮 "${record.title}" esch glöscht worde`
        }

        setTimeout(function() { text = undefined }, 5000);
    }

    onMount(async () => {
        unsubscribe = await pb
            .collection('videos')
            .subscribe('*', async ({ action, record }) => {
                if (action === 'create') {
                    // Fetch associated user
                    const submitter = await pb.collection('users').getOne(record.submitter);
                    record.expand = { submitter };
                    videos.set([record,...$videos])
                }
                if (action === 'delete') {
                    videos.set($videos.filter((m) => m.id !== record.id));
                }
                displayEvent(action, record);
            });

    });


    onDestroy(() => {
        unsubscribe?.();
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
