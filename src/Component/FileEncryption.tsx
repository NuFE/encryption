import { Button, FilePicker, Heading, Pane, Spinner, Text, toaster } from 'evergreen-ui';
import { useCallback, useState } from 'react';
import useWASM from '../wasm/useWASM';
import Module from "../wasm/wasm";

const FileEncryption = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);
  const module = useWASM(Module);

  const handleFileChange = (files: FileList | null) => {
    setFile(files ? files[0] : null);
  };

  const handleEncrypt = useCallback(async () => {
    if (!file) {
      toaster.danger('Please select a file to encrypt');
      return;
    }

    setIsLoading(true);

    let reader = new FileReader();
    reader.onload = function (e) {
      if (!module || !e.target?.result) {
        console.error('module is null or file read failed');
        return;
      }

      let inputBytes = new Uint8Array(e.target.result as ArrayBuffer);
      let paddingSize = 16 - (inputBytes.length % 16);
      let paddedInput = new Uint8Array(inputBytes.length + paddingSize);
      paddedInput.set(inputBytes);
      paddedInput.fill(paddingSize, inputBytes.length);
      let inputPtr = module._malloc(paddedInput.length);
      module.HEAPU8.set(paddedInput, inputPtr);
      module.ccall('encrypt', 'number', ['number', 'number'], [inputPtr, paddedInput.length]);

      let encryptedBytes = new Uint8Array(module.HEAPU8.buffer, inputPtr, paddedInput.length);
      
      module._free(inputPtr);

      const blob = new Blob([encryptedBytes], { type: "application/octet-stream" });
      setDownloadUrl(URL.createObjectURL(blob));
    };

    reader.readAsArrayBuffer(file);
    setIsLoading(false);
    toaster.success('File encrypted successfully');

  }, [file, module]);

  return (
    <Pane
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      background="tint2"
      height="100vh"
      width="100vw"
    >
      <Heading size={700} marginBottom={20}>Encrypt your file</Heading>

      <FilePicker
        width={250}
        marginBottom={32}
        onChange={handleFileChange}
        placeholder="Select a file to encrypt..."
      />

      <Button
        iconBefore={isLoading ? Spinner : undefined}
        isLoading={isLoading}
        disabled={!file}
        onClick={handleEncrypt}
      >
        Encrypt File
      </Button>

      {downloadUrl && (
        <Pane
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
          marginTop={48}
        >
          <a
            href={downloadUrl}
            download={`${file?.name}_encrypted`}
            style={{ textDecoration: 'none' }}
          >   <Text size={500} marginTop={16}>{file?.name}_encrypted</Text>
          </a>

        </Pane>
      )}

    </Pane>
  );
};

export default FileEncryption;
