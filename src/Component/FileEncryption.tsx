import { Button, FilePicker, Heading, Pane, Spinner, Text, toaster } from 'evergreen-ui';
import { useState } from 'react';

const FileEncryption = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [encryptedFile, setEncryptedFile] = useState<File | null>(null);

  const handleFileChange = (files: FileList | null) => {
    setFile(files ? files[0] : null);
  };

  const handleEncrypt = async () => {
    if (!file) {
      toaster.danger('Please select a file to encrypt');
      return;
    }

    setIsLoading(true);

    // Here you should call your file encryption logic.
    // Since I don't have access to this logic, I'm just setting a delay to simulate processing.

    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
    setEncryptedFile(file);
    toaster.success('File encrypted successfully');
  };

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

      {encryptedFile && (
        <>
          <Heading size={600} marginTop={48}>Encrypted File</Heading>
          <Text size={500} marginTop={16}>{encryptedFile.name}</Text>
        </>
      )}
    </Pane>
  );
};

export default FileEncryption;
