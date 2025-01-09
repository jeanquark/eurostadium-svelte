import { json } from '@sveltejs/kit';
import admin from '../../../../lib/firebase/admin'

// More on why use event driven api routes
// https://kit.svelte.dev/docs/routing#server-receiving-data
export async function GET({ request }) {
    try {
        const db = admin.firestore()
        const country = 'germany'

        const { default: data } = await import(`../../../../../static/json/teams/${country}.json`, { assert: { type: "json" } })

        console.log('data: ', data)
        // return json(data);

        // 1) Retrieve collection data
        const stadiumsRef = db.collection('countries').doc(country).collection('stadiums');
        const snapshot = await stadiumsRef.get();

        // 2) Delete collection data
        snapshot.forEach(doc => {
            // console.log('doc.id: ', doc.id)
            db.collection('countries').doc(country).collection('stadiums').doc(doc.id).delete();
        });

        // 3) Add new collection data
        for (let i = 0; i < data.length; i++) {
            await db.collection('countries').doc(country).collection('stadiums').add(data[i])
        }
        console.log('Done!')

        return json(data);
    } catch (error) {
        console.log('error: ', error);
        return json(new Response(error, {
            status: 404
        }))
    }
}
