import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { Link } from "react-router-dom";


// Style
import "@/styles/AboutLayout.css";

const AboutLayout = () => {
  return (
    <>
      <Header />
      <div className="about-layout-content">
        <div className="about-mission">
          <div className="token-panel mission-panel">
            <p className="italic-text">
              <strong>About This Project</strong>
              <br />
              This is a placeholder About page. You can use this space to describe your application, its mission, or any information you want to share with users.
            </p>
          </div>

          <div className="meme-vibe">
            <p>
              Welcome to our generic web application! This About page is intended as a template for your own content. Replace this text with information about your team, your goals, or anything else relevant to your project.
            </p>
            <p>
              No details provided yet. Stay tuned for updates!
            </p>

            <p>
              This project is under active development. All information here is for demonstration purposes only.
            </p>

            <div className="community-claim">
              <p>
                <strong>Community Notice</strong>
              </p>
              <p>This application is open for community feedback and collaboration.</p>

              <p className="italic-text">
                Placeholder text: Replace with your own community story or announcement.
              </p>
            </div>
          </div>
        </div>

        <div className="icon-container">
          <div className="icon-item">
            <Link to="#">
              <span className="about-icon" style={{fontSize: 60, display: 'inline-block'}}>🌐</span>
            </Link>
            <p>Website</p>
          </div>

          <div className="icon-item">
            <Link to="#">
              <span className="about-icon" style={{fontSize: 60, display: 'inline-block'}}>💬</span>
            </Link>
            <p>Community</p>
          </div>

          <div className="icon-item">
            <Link to="#">
              <span className="about-icon" style={{fontSize: 60, display: 'inline-block'}}>📢</span>
            </Link>
            <p>Announcements</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutLayout;
