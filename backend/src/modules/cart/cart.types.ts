export type cartItem = {
    productId: string;
    quantity: number;
    productName: string;
}

export type cartItemAction = "add" | "remove";

export type cartItemChange = {
    productId: string;
    productName: string;
    action: cartItemAction;
    quantity: number;
    removeAll?: boolean;
}
