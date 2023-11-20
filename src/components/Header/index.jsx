import Delivery from "../Delivery";
import HeaderLogo from "../HeaderLogo";
import NavigationBar from "../NavigationBar";
import PanelHeader from "../PanelHeader";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.page_header}>
      <PanelHeader />
      <div className="container mx-auto">
        <div className={styles.header_content}>
          <HeaderLogo />
          <NavigationBar/>
          <Delivery/>
        </div>
      </div>
       
    </header>
  );
}

export default Header;
