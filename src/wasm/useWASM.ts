import { useEffect, useState } from "react";

export interface BaseWASMModule {
  HEAPU8: Uint8Array;
  _malloc: Function;
  ccall: Function;
}

const useWASM = <T>(
  helperOutput: (
    Module?: unknown,
    ...args: unknown[]
  ) => Promise<BaseWASMModule & T>
) => {
  const [module, setModule] = useState<(BaseWASMModule & T) | null>(null);
  useEffect(() => {
    helperOutput().then((m) => {
      !module && setModule(m);
    });
  },[helperOutput])

  return module;
};

export default useWASM;
