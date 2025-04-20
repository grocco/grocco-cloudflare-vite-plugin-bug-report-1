import { DurableObject } from "cloudflare:workers";

export class MyDurableObject extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    console.log("constructor");
    this.ctx.blockConcurrencyWhile(async () => {
      console.log("blockConcurrencyWhile");
    });
  }

  async sayHello(name: string = "world"): Promise<string> {
    console.log("sayHello");
    return `Hello ${name}!`;
  }
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext) {
    console.log(new URL(req.url).pathname);
    if (new URL(req.url).pathname === "/") {
      const DOId = env.MY_DURABLE_OBJECT.idFromName("my_durable_object");
      const DOStub = env.MY_DURABLE_OBJECT.get(DOId);
      const resp = await DOStub.sayHello(
        new URL(req.url).searchParams.get("name") || "world"
      );
      return new Response(resp);
    }
    return new Response(`Running in ${navigator.userAgent}!`);
  },
};
