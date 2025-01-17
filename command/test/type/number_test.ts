import { assertEquals, assertThrowsAsync } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

const cmd = new Command()
  .throwErrors()
  .option("-f, --flag [value:number]", "description ...")
  .option("--no-flag", "description ...")
  .action(() => {});

Deno.test("command typeString flag", async () => {
  const { options, args } = await cmd.parse(["-f"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command typeString flagValue", async () => {
  const { options, args } = await cmd.parse(["--flag", "123"]);

  assertEquals(options, { flag: 123 });
  assertEquals(args, []);
});

Deno.test("command optionStandalone flagCombineLong", async () => {
  await assertThrowsAsync(
    async () => {
      await cmd.parse(["-f", "123", "unknown"]);
    },
    Error,
    "No arguments allowed for command: COMMAND",
  );
});

Deno.test("command optionStandalone flagCombineLong", async () => {
  await assertThrowsAsync(
    async () => {
      await cmd.parse(["-f", "abc"]);
    },
    Error,
    "Option --flag must be of type number but got: abc",
  );
});
