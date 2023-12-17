import { expect } from "chai";
import {
  configure_experiment,
  get_account,
  set_mockup,
  set_mockup_now,
  expect_to_fail,
} from "@completium/experiment-ts";
import { hello_world } from "./binding/hello_world";

/* Accounts */
const alice = get_account("alice");
const bob = get_account("bob");

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

  it("should get an undefined last message if no message has been set", async () => {
    const message = await hello_world.view_get_last_message({ as: alice });
    expect(message).to.be.undefined;
  });

  it("should get an undefined message by author if no message has been set", async () => {
    const message = await hello_world.view_get_message_by_author(
      alice.get_address(),
      {
        as: alice,
      }
    );
    expect(message?.is_none()).to.be.true;
  });

  it("Alice sets a new message", async () => {
    await hello_world.set_message("Hello from Alice", { as: alice });
    const message = await hello_world.view_get_last_message({ as: alice });
    expect(message?.get().content).to.equal("Hello from Alice");
    const messages = await hello_world.view_get_all_messages({ as: alice });
    expect(messages?.length).to.equal(1);
  });

  it("should get an undefined message by author if Bob is the author and has not yet added a message", async () => {
    const message = await hello_world.view_get_message_by_author(
      bob.get_address(),
      {
        as: alice,
      }
    );
    expect(message?.is_none()).to.be.true;
  });

  it("Bob sets a new message", async () => {
    await hello_world.set_message("Hello from Bob", { as: bob });
    const message = await hello_world.view_get_last_message({ as: bob });
    expect(message?.get().content).to.equal("Hello from Bob");
    const messages = await hello_world.view_get_all_messages({ as: alice });
    expect(messages?.length).to.equal(2);
  });

  it("Bob tries to set a new message and fails", async () => {
    await expect_to_fail(async () => {
      await hello_world.set_message("Hello from Bob", { as: bob });
    }, hello_world.errors.AUTHOR_HAS_ALREADY_ADDED_A_MESSAGE);
  });

  it("Retrieve message by Alice", async () => {
    const message = await hello_world.view_get_message_by_author(
      alice.get_address(),
      { as: alice }
    );
    expect(message?.get().content).to.equal("Hello from Alice");
  });

  it("Retrieve all messages", async () => {
    const messages = await hello_world.view_get_all_messages({ as: alice });
    expect(messages?.length).to.equal(2);
    expect(messages?.[0].toString()).to.equal(alice.get_address().toString());
    expect(messages?.[1].toString()).to.equal(bob.get_address().toString());
  });
});
