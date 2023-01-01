<script>
    import {onDestroy, onMount} from "svelte";
    import {pb, videos} from "$lib/pocketbase";

    let unsubscribe;
    let text;
    let icon;


    async function displayEvent(action, record) {
        const submitter = await pb.collection('users').getOne(record.submitter);
        if (action === 'create') {
            text = `De ${submitter.username} het s'Video "${record.title}" hinzuegfüegt`
            icon = "add_circle"
        } else {
            text = `"${record.title}" esch glöscht worde`
            icon = "delete"
        }

        setTimeout(function () {
            text = undefined
        }, 5000);
    }

    onMount(async () => {
        unsubscribe = await pb
            .collection('videos')
            .subscribe('*', async ({action, record}) => {
                if (action === 'create') {
                    // Fetch associated user
                    const submitter = await pb.collection('users').getOne(record.submitter);
                    record.expand = {submitter};
                    videos.set([record, ...$videos])
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

{#if text}
    <div class="active toast blue white-text" on:click={() => text = undefined}>
        <i>{icon}</i>
        <span>{text}</span>
    </div>
{/if}
