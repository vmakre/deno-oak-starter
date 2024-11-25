// This is not necessary, but is potentially helpful to see in the console
export function printStartupMessage({ hostname, port, secure }: {
    hostname: string;
    port: number;
    secure?: boolean;
  }): void {
    if (!hostname || hostname === "0.0.0.0") hostname = "localhost";
    const address =
      new URL(`http${secure ? "s" : ""}://${hostname}:${port}/`).href;
    console.log(`Listening at ${address}`);
    console.log("Use ctrl+c to stop");
  }