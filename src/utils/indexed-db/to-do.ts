import type { Todo } from "../types";

const DB_NAME = import.meta.env.VITE_DB_NAME;
const DB_VERSION = 1;
const STORE_NAME = import.meta.env.VITE_TO_DO_STORE_NAME;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
	if (dbPromise) return dbPromise;

	dbPromise = new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = (event) => {
			const db = request.result;

			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, {
					keyPath: "id",
					autoIncrement: true,
				});
			}
		};

		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onerror = () => {
			reject(request.error);
		};
	});

	return dbPromise;
}

export async function getDB(): Promise<IDBDatabase> {
	return await openDB();
}

export async function addData(data: Todo) {
	const db = await getDB();
	const tx = db.transaction(STORE_NAME, "readwrite");
	const store = tx.objectStore(STORE_NAME);
	store.add(data);
	return tx.oncomplete;
}

export async function getAllData() {
	const db = await getDB();
	const tx = db.transaction(STORE_NAME, "readonly");
	const store = tx.objectStore(STORE_NAME);
	return store.getAll();
}
