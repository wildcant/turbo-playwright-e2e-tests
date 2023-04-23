export type OptionalId<T> = Omit<T, 'id'> & { id?: number | undefined }
export type OptionalObjectId<T> = Omit<T, '_id'> & { _id?: string | undefined }
