export interface TagData {
    id: string;
    name: string;
    color: string;
}

export interface TagsData {
    ownerId: string;
    tags: TagData[];
}