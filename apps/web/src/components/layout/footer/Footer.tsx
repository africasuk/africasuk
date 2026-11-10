
import Container from "../Container";
import FooterLinks from "./FooterLinks";
import SocialLinks from "./SocialLinks";
import Copyright from "./Copyright";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <Container>
        <FooterLinks />
        <SocialLinks />
        <Copyright />
      </Container>
    </footer>
  );
}
