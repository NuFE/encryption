import { Button, Heading, Pane } from 'evergreen-ui';
import { Link } from 'react-router-dom';
import { Icon } from "./Icon";
const Home = () => {
  return (
    <Pane
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      background="tint2"
    >
      <Icon src="/hat.svg" />
      <Heading size={800} marginBottom={50}>
        Welcome to the Encryption App
      </Heading>

      <Pane display="flex" justifyContent="center" width="100%">
        <Link to="/text-encryption" style={{ textDecoration: 'none' }}>
          <Button marginRight={16} intent="success" size="large">Text Encryption</Button>
        </Link>
        <Link to="/file-encryption" style={{ textDecoration: 'none' }}>
          <Button intent="success"  marginRight={16} size="large" >File Encryption</Button>
        </Link>
        <Link to="https://gamma.app/docs/Securely-Encrypt-Text-and-Files-o3jhk29le89p7a6" style={{ textDecoration: 'none' }}>
          <Button intent="info" size="large" appearance='minimal' >Notes</Button>
        </Link>
      </Pane>
    </Pane>
  );
}

export default Home;
