export class Item{
    public id: number;
    public name: string;
    public amount: number;
    public origin: string;
    public comment: string;
    public paid: boolean;
    public collectionId: number;
    
    constructor(id: number, name: string, amount: number, origin: string, paid: boolean, comment: string, collectionId?: number){
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.origin = origin;
        this.paid = paid;
        this.comment = comment;
        if(collectionId){
            this.collectionId = collectionId;
        }else{
            this.collectionId = 0;
        }
        
    }
}

export class Collection{
        public id: number;
        public name: string;
        public archived: boolean;
        public items: Item[];
    constructor(id: number, name: string, archived: boolean, items: Item[]){
        this.id = id,
        this.name = name;
        this.archived = archived;
        this.items = items;
    }

}

// export class Item {
//     id: number | undefined;
//     name: stringProp;
//     amount: numberProp;
//     origin: stringProp;
//     comment: string;

//     constructor(item: IItem | Item | null){
//         if(item === null){
//             return;
//         }

//         this.id = item.id;
//         this.name = item.name;
//         this.amount = item.amount;
//         this.origin = item.origin;
//         this.comment = item.comment;
//     }
//}