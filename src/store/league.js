import { writable } from "svelte/store";
import { db } from "../lib/firebase/firebase";
import {
    collection,
    query,
    where,
    doc,
    getDoc,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

// export const leagues = writable([
// //   { id: 1, text: "Learn Svelte state management", completed: false },
// //   { id: 2, text: "Build a Todo-list with state management", completed: false },
// ]);

export const leagueStore = writable({
    leagues: [
        // { id: 1, text: "Learn Svelte state management", completed: false },
        // { id: 2, text: "Build a Todo-list with state management", completed: false },
    ],
})

export const leagueHandlers = {
    fetchLeagues: async () => {
    //     const querySnapshot = await getDocs(collection(db, "leagues"));
	// 	// console.log('querySnapshot: ', querySnapshot);
	// 	querySnapshot.forEach((doc) => {
	// 		// doc.data() is never undefined for query doc snapshots
	// 		console.log(doc.id, " => ", doc.data());
	// 	});
    }
}