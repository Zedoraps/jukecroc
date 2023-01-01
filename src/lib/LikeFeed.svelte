<script>
    import {onDestroy, onMount} from "svelte";
    import {likes, pb} from "$lib/pocketbase";

    let unsubscribeLikes;
    let text;
    let icon;

    async function displayEvent(action, record) {
        const submitter = await pb.collection('users').getOne(record.user);
        const video = await pb.collection('videos').getOne(record.video);
        if (action === 'create') {
            text = `De ${submitter.username} findest Video "${video.title}" geil`;
            icon = "thumb_up"
        } else {
            text = `De ${submitter.username} findest Video "${video.title}"  nömme so geil`
            icon = "thumb_down"
        }

        setTimeout(function () {
            text = undefined
        }, 5000);
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

{#if text}
    <div class="active toast blue white-text" on:click={() => text = undefined}>
        <i>{icon}</i>
        <span>{text}</span>
    </div>
{/if}
