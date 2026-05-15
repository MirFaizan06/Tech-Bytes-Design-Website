'use client';

import { useEffect, useRef, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

interface UseFirestoreCollectionResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

export function useFirestoreCollection<T extends { id: string }>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = []
): UseFirestoreCollectionResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<T[] | null>(null);

  useEffect(() => {
    if (cacheRef.current) {
      setData(cacheRef.current);
      setLoading(false);
      return;
    }

    const q = query(collection(db, collectionName), ...queryConstraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        cacheRef.current = docs;
        setData(docs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return { data, loading, error };
}
