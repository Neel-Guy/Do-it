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

export function getAllData() {
	return new Promise((resolve) => {
		const request = indexedDB.open(DB_NAME);

		request.onsuccess = () => {
			const db = request.result;
			const tx = db.transaction(STORE_NAME, "readonly");
			const store = tx.objectStore(STORE_NAME);
			const res = store.getAll();

			res.onsuccess = () => {
				resolve(res.result);
			};
		};
	});
}

export function editDataEntry(key: string, data: Partial<Todo>) {
	return new Promise((resolve) => {
		const request = indexedDB.open(DB_NAME);

		request.onsuccess = () => {
			const db = request.result;
			const tx = db.transaction(STORE_NAME, "readwrite");
			const store = tx.objectStore(STORE_NAME);
			const res = store.get(key);

			res.onsuccess = (event) => {
				let entry = (event.target as IDBRequest)?.result;

				if (entry) {
					entry = {
						...entry,
						...data,
					};

					const result = store.put(entry);

					result.onsuccess = () => {
						resolve(result.result);
					};

					result.onerror = () => {
						throw new Error("Error updating entry.");
					};
				} else {
					throw new Error("Entry not found.");
				}
			};
		};
	});
}
