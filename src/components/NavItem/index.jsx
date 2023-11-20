import Link from "next/link";
import Image from 'next/image';
import {useRouter} from "next/router";

import styles from "./NavItem.module.css";

function NavItem({ categories }) {
    const router = useRouter();
    const currentPath = router.pathname;
  return (
    <li >
    <Link className={currentPath=== categories.path ? styles.current : ''} href={categories.path}>
        {categories.label}
    </Link> 
      {categories.child && categories.child.length > 0 ? (
        <div className={styles.nav_child}> 
          {categories.child.map((child) => {
            return (
              <Link key={`NavItem_${child.id}`} href={`/thuc-don/${child.path}`} className = {styles.item_child}>
                <div className={styles.nav_child_item}>
                  <div>
                  <Image width={80} height={50} src={child.media.coverImageUrl} alt="Gà cay thơm ngon" />
                  </div>
                  <div>{child.name}</div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : null}
    </li>
  );
}

export default NavItem;
