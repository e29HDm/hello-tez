import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
const set_message_arg_to_mich = (new_message: string): att.Micheline => {
    return att.string_to_mich(new_message);
}
const reset_message_arg_to_mich = (): att.Micheline => {
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
    async set_message(new_message: string, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_message", set_message_arg_to_mich(new_message), params);
        }
        throw new Error("Contract not initialised");
    }
    async reset_message(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "reset_message", reset_message_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_message_param(new_message: string, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_message", set_message_arg_to_mich(new_message), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_reset_message_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "reset_message", reset_message_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_message(): Promise<string> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_string(storage);
        }
        throw new Error("Contract not initialised");
    }
    errors = {};
}
export const hello_world = new Hello_world();
