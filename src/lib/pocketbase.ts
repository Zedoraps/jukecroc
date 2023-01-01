import PocketBase, {Record} from 'pocketbase'
import { writable} from "svelte/store";

export const pb = new PocketBase("https://croc.moes.li:443")

export const currentUser = writable(pb.authStore.model)

pb.authStore.onChange((auth) => {
    console.log('authStore changed', auth);
    currentUser.set(pb.authStore.model);
});


export const likes = writable([] as Record[])
export const videos = writable([] as Record[])

pb.collection('likes').getFullList().then(value => likes.set(value))

export function loadVideosBySort(sort: string, includeAdded: boolean) {
    if(includeAdded){
        pb.collection('videos').getList(1, 50, {
            sort: sort,
            expand: 'submitter',
        }).then(result => videos.set(result.items));
    }else{
        pb.collection('videos').getList(1, 50, {
            sort: sort,
            expand: 'submitter',
            filter: 'added=false'
        }).then(result => videos.set(result.items));
    }
}

loadVideosBySort("-created", false);