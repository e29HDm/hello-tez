import { expect } from "chai";
import {
  configure_experiment,
  get_account,
  set_mockup,
  set_mockup_now,
} from "@completium/experiment-ts";
import { hello_world } from "./binding/hello_world";

/* Accounts */
const alice = get_account("alice");

/* Initialisation */
describe("Initialisation", () => {
  it("Configure experiment", async () => {
    await configure_experiment({
      account: "alice",
      endpoint: "mockup",
      quiet: true,
    });
  });
  it("set_mockup", () => {
    set_mockup();
  });
  it("set_mockup_now", () => {
    set_mockup_now(new Date(Date.now()));
  });
});

/* Contract Tests */
describe("[HELLO WORLD] Contract Tests", () => {
  it("Deploy hello_world contract", async () => {
    await hello_world.deploy({ as: alice });
  });

  it('Initial message should be "Hello, World!"', async () => {
    const currentMessage = await hello_world.get_message();
    expect(currentMessage).to.equal("Hello, World!");
  });

  it("Change message to custom text", async () => {
    await hello_world.set_message("Bonjour, Monde!", { as: alice });
    const newMessage = await hello_world.get_message();
    expect(newMessage).to.equal("Bonjour, Monde!");
  });

  it("Reset message to default", async () => {
    await hello_world.reset_message({ as: alice });
    const resetMessage = await hello_world.get_message();
    expect(resetMessage).to.equal("Hello, World!");
  });
});
