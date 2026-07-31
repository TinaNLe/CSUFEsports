import styles from "./teams.module.css";
import { getAchievementsByTeam } from "@/lib/achievements";
import { formatDate } from "@/lib/date";

const teams = [
  "Valorant",
  "League",
  "Rocket League",
  "Apex",
  "COD",
  "CS2",
  "Splatoon",
  "R6",
];

const marqueeItems = [...teams, ...teams, ...teams];

export default async function TeamsPage() {
  const achievementsByTeam = await getAchievementsByTeam();

  // Rendered from whatever team names actually exist in Notion, rather than
  // filtered through the fixed `teams` list — that list is only the roster
  // lineup below, and doesn't always match how a team is named in Notion.
  const rows = Object.entries(achievementsByTeam).flatMap(([game, achievements]) =>
    achievements.map((achievement) => ({ game, achievement }))
  );

  return (
    <div style={{ paddingTop: "80px" }}>
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          <div className={styles.marqueeGroup}>
            {marqueeItems.map((game, i) => (
              <span key={i} className={styles.marqueeText}>CSUF</span>
            ))}
          </div>
          <div className={styles.marqueeGroup} aria-hidden="true">
            {marqueeItems.map((game, i) => (
              <span key={i} className={styles.marqueeText}>CSUF</span>
            ))}
          </div>
        </div>
      </div>
      <section className={styles.teams}>
        <h1 className={styles.heading}>Teams</h1>
        <p className={styles.subheading}>
          Meet the rosters representing CSUF across our competitive titles.
        </p>
        <span className={styles.sectionLabel}>Achievements</span>
        <div className={styles.tableCard}>
          <div className={`${styles.row} ${styles.headerRow}`}>
            <span className={styles.headerCell}>Game</span>
            <span className={styles.headerCell}>Achievement</span>
            <span className={styles.headerCell}>Date</span>
          </div>
          {rows.map(({ game, achievement }) => (
            <div key={achievement.id} className={styles.row}>
              <div className={styles.gameCell}>
                {achievement.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={achievement.image} alt="" className={styles.gameLogo} />
                ) : (
                  <span className={styles.gameBadge}>{game.charAt(0)}</span>
                )}
                <span className={styles.gameName}>{game}</span>
              </div>
              <span className={styles.achievementCell}>
                {achievement.segments.map((segment, i) =>
                  segment.href ? (
                    <a
                      key={i}
                      href={segment.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.achievementLink}
                    >
                      {segment.text}
                    </a>
                  ) : (
                    <span key={i}>{segment.text}</span>
                  )
                )}
              </span>
              <span className={styles.dateCell}>
                {achievement.date ? formatDate(achievement.date) : ""}
              </span>
            </div>
          ))}
        </div>
        <span className={styles.sectionLabel}>Rosters</span>
        <div className={styles.cardList}>
          {teams.map((game) => (
            <div key={game} className={styles.teamCard}>
              <div className={styles.teamMedia}>
                <span className={styles.teamInitial}>{game.charAt(0)}</span>
              </div>
              <div className={styles.teamBody}>
                <div className={styles.teamCardTitle}>{game}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
