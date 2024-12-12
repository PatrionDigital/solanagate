const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>© 2024 My dApp. All rights reserved.</p>
        <div>
          <a href="https://twitter.com" style={styles.link}>
            Twitter
          </a>{" "}
          |
          <a href="https://github.com" style={styles.link}>
            {" "}
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#282c34",
    color: "white",
    padding: "10px 0",
    marginTop: "20px",
    textAlign: "center",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
  },
  text: {
    fontSize: "14px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    marginLeft: "10px",
  },
};

export default Footer;
