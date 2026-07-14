import Link from "next/link";
import styles from "./Footer.module.css";


const socials = [
  { href: "https://twitter.com/csufesports", label: "Twitter" },
  { href: "https://tiktok.com/@csufesports", label: "TikTok" },
  { href: "https://discord.gg/csufesports", label: "Discord" },
  { href: "https://twitch.tv/csufesports", label: "Twitch" },
];

const links = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/teams", label: "Teams" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/leadership", label: "Leadership" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <span className={styles.brand}>CSUF Gaming & Esports</span>

        <div className={styles.columns}>
          <div className={styles.left}>
            <p className={styles.linksHeading}>Navigation</p>
            <table className={styles.linksTable}>
              <tbody>
                {links.map((link) => (
                  <tr key={link.href}>
                    <td>
                      <Link href={link.href} className={styles.link}>
                        {link.label}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.column}>
            <p className={styles.linksHeading}>Partnerships</p>
            <p className={styles.partnerText}>
              Interested in partnering with CSUF Gaming & Esports?
            </p>
            <a href="mailto:csufgamingandesports@gmail.com" className={styles.link}>
              Email Us
            </a>
          </div>

          <div className={styles.right}>
            <p className={styles.linksHeading}>Socials</p>
            <table className={styles.linksTable}>
              <tbody>
                {socials.map((s) => (
                  <tr key={s.href}>
                    <td>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        {s.label}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} CSUF Gaming & Esports. All rights reserved.</span>
      </div>
    </footer>
  );
}
