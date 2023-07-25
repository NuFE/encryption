import { Button, Heading, Pane } from 'evergreen-ui';
import { Link } from 'react-router-dom';

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
      <Heading size={800} marginBottom={50}>
        Welcome to the Encryption App
      </Heading>

      <Pane display="flex" justifyContent="center" width="100%">
        <Link to="/text-encryption" style={{ textDecoration: 'none' }}>
          <Button marginRight={16} intent="success" size="large">Text Encryption</Button>
        </Link>

        <Link to="/file-encryption" style={{ textDecoration: 'none' }}>
          <Button intent="success"  size="large" >File Encryption</Button>
        </Link>
      </Pane>
    </Pane>
  );
}

export default Home;
