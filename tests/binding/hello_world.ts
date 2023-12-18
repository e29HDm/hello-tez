import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
export const messages_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("address", []);
export class messages_value implements att.ArchetypeType {
    constructor(public content: string, public timestamp: Date) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([att.string_to_mich(this.content), att.date_to_mich(this.timestamp)]);
    }
    equals(v: messages_value): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): messages_value {
        return new messages_value(att.mich_to_string((input as att.Mpair).args[0]), att.mich_to_date((input as att.Mpair).args[1]));
    }
}
export const messages_value_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("string", ["%content"]),
    att.prim_annot_to_mich_type("timestamp", ["%timestamp"])
], []);
export type messages_container = Array<[
    att.Address,
    messages_value
]>;
export const messages_container_mich_type: att.MichelineType = att.pair_annot_to_mich_type("map", att.prim_annot_to_mich_type("address", []), att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("string", ["%content"]),
    att.prim_annot_to_mich_type("timestamp", ["%timestamp"])
], []), []);
const set_message_arg_to_mich = (new_content: string): att.Micheline => {
    return att.string_to_mich(new_content);
}
const view_get_last_message_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const view_get_message_by_author_arg_to_mich = (author_addr: att.Address): att.Micheline => {
    return author_addr.to_mich();
}
const view_get_all_messages_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
export class Hello_world {
    address: string | undefined;
    constructor(address: string | undefined = undefined) {
        this.address = address;
    }
    get_address(): att.Address {
        if (undefined != this.address) {
            return new att.Address(this.address);
        }
        throw new Error("Contract not initialised");
    }
    async get_balance(): Promise<att.Tez> {
        if (null != this.address) {
            return await ex.get_balance(new att.Address(this.address));
        }
        throw new Error("Contract not initialised");
    }
    async deploy(params: Partial<ex.Parameters>) {
        const address = (await ex.deploy("./contracts/hello_world.arl", {}, params)).address;
        this.address = address;
    }
    async set_message(new_content: string, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_message", set_message_arg_to_mich(new_content), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_message_param(new_content: string, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_message", set_message_arg_to_mich(new_content), params);
        }
        throw new Error("Contract not initialised");
    }
    async view_get_last_message(params: Partial<ex.Parameters>): Promise<att.Option<messages_value> | undefined> {
        if (this.address != undefined) {
            const mich = await ex.exec_view(this.get_address(), "get_last_message", view_get_last_message_arg_to_mich(), params);
            return mich.value ? att.Option.from_mich(mich.value, x => { return messages_value.from_mich(x); }) : undefined;
        }
        throw new Error("Contract not initialised");
    }
    async view_get_message_by_author(author_addr: att.Address, params: Partial<ex.Parameters>): Promise<att.Option<messages_value> | undefined> {
        if (this.address != undefined) {
            const mich = await ex.exec_view(this.get_address(), "get_message_by_author", view_get_message_by_author_arg_to_mich(author_addr), params);
            return mich.value ? att.Option.from_mich(mich.value, x => { return messages_value.from_mich(x); }) : undefined;
        }
        throw new Error("Contract not initialised");
    }
    async view_get_all_messages(params: Partial<ex.Parameters>): Promise<Array<att.Address> | undefined> {
        if (this.address != undefined) {
            const mich = await ex.exec_view(this.get_address(), "get_all_messages", view_get_all_messages_arg_to_mich(), params);
            return mich.value ? att.mich_to_list(mich.value, x => { return att.Address.from_mich(x); }) : undefined;
        }
        throw new Error("Contract not initialised");
    }
    async get_last_author(): Promise<att.Option<att.Address>> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Option.from_mich((storage as att.Mpair).args[0], x => { return att.Address.from_mich(x); });
        }
        throw new Error("Contract not initialised");
    }
    async get_messages(): Promise<messages_container> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_map((storage as att.Mpair).args[1], (x, y) => [att.Address.from_mich(x), messages_value.from_mich(y)]);
        }
        throw new Error("Contract not initialised");
    }
    errors = {
        AUTHOR_HAS_ALREADY_ADDED_A_MESSAGE: att.string_to_mich("\"Author has already added a message\""),
        OPTION_IS_NONE: att.string_to_mich("\"OPTION_IS_NONE\"")
    };
}
export const hello_world = new Hello_world();
