import { SelectField } from 'evergreen-ui';
import { ChangeEvent, FC } from 'react';

interface SelectEncryptionAlgorithmProps {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}

const SelectEncryptionAlgorithm: FC<SelectEncryptionAlgorithmProps> = ({ value, onChange }) => {
  return (
    <SelectField
      width={250}
      label="Encryption Algorithm"
      value={value}
      onChange={onChange}
      marginBottom={30}
    >
      <option value="aes">AES</option>
      <option value="des">DES</option>
      <option value="rsa">RSA</option>
    </SelectField>
  );
}

export default SelectEncryptionAlgorithm;
