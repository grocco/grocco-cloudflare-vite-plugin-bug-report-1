When using the vite plugin dev command, durable object's `this.ctx.blockConcurrencyWhile` does not block incoming calls from running as it would be supposed to.

The following DO

```ts
export class MyDurableObject extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    console.log("constructor");
    this.ctx.blockConcurrencyWhile(async () => {
      console.log("blockConcurrencyWhile");
    });
  }

  async sayHello(name: string): Promise<void> {
    console.log("sayHello");
  }
}
```

when run without vite plugin (e.g `pnpm wrangler dev`) it correctly prints

```
constructor
blockConcurrencyWhile
sayHello
```

when run with the vite plugin in dev mode (`pnpm vite dev`) it wrongly prints

```
constructor
sayHello
blockConcurrencyWhile
```

then again, when run in preview (`pnpm vite preview`) it correctly prints

```
constructor
blockConcurrencyWhile
sayHello
```
