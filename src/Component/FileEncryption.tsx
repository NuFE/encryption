import { FilePicker, Heading, Pane, toaster } from 'evergreen-ui';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import useEncryption from '../hook';
import useWASM from '../wasm/useWASM';
import Module from "../wasm/wasm";
import { EncryptionBtn } from './EncryptionBtn/Button';
import { Icon } from './Icon';
import SelectEncryptionAlgorithm from './SelectEncryptionAlgorithm';

const FileEncryption = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);
  const module = useWASM(Module);
  const [algorithm, setAlgorithm] = useState('aes');
  const { encrypt } = useEncryption(module, 'aes'); // Use our new hook, hardcoded to use AES encryption for now
  const linkRef = useRef<HTMLAnchorElement>(null);
  const handleChangeAlgorithm = (event: ChangeEvent<HTMLSelectElement>) => {
    setAlgorithm(event.target.value);
  }
  const handleFileChange = (files: FileList | null) => {
    setFile(files ? files[0] : null);
  };

  const handleEncrypt = useCallback(async () => {
    if (!file) {
      toaster.danger('Please select a file to encrypt');
      return;
    }
    setDownloadUrl(undefined);
    setIsLoading(true);

    let reader = new FileReader();
    reader.onload = async function (e) {
      if (!e.target?.result) {
        toaster.danger('File not found');
        return;
      }
      let inputBytes = new Uint8Array(e.target.result as ArrayBuffer);
      let encryptedBytes = await encrypt(inputBytes);

      const blob = new Blob([encryptedBytes!], { type: "application/octet-stream" });
      setDownloadUrl(URL.createObjectURL(blob));
      if (linkRef.current){
        linkRef.current.href = URL.createObjectURL(blob);
        linkRef.current.click();
      }
      setIsLoading(false);
      toaster.success('File encrypted successfully');
    };
    reader.onerror = async function () {
      toaster.danger('File encryption failed');
      setIsLoading(false);
    }
    reader.readAsArrayBuffer(file);

  }, [file, encrypt]);

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
      <Icon src="/div.svg" />
      <Heading size={700} marginBottom={20}>Encrypt your file</Heading>

      <FilePicker
        width={250}
        marginBottom={32}
        onChange={handleFileChange}
        placeholder="Select a file to encrypt..."
      />

      <SelectEncryptionAlgorithm value={algorithm} onChange={handleChangeAlgorithm} />

        <Pane
          alignItems="center"
          justifyContent="center"
          display="flex"
          marginTop={10}
        >
          <EncryptionBtn
            disabled={!file}
            onClick={handleEncrypt}
            isLoading={isLoading}
          >
            Encrypt File
          </EncryptionBtn>

        </Pane>
      <a href='' download={file?.name} style={{ display: 'none'}} ref={linkRef}>{downloadUrl}</a>
    </Pane>
  );
};

export default FileEncryption;
