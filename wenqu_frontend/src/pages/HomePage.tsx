import { Card, Skeleton } from '@/shared/ui'

import styles from './HomePage.module.css'

const placeholderCards = [0, 1, 2]

export function HomePage() {
  return (
    <div className={styles.root}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>首页</p>
        <h1 className={styles.title}>读技术，也问技术</h1>
        <p className={styles.lead}>
          在问渠，长文可以被检索、被追问。每篇知文都会建立向量索引，阅读时可就任意段落发起提问，答案附带可回溯的来源。
        </p>
      </section>

      <section aria-labelledby="weekly-picks">
        <div className={styles.sectionHead}>
          <h2 id="weekly-picks" className={styles.sectionTitle}>
            本周精选
          </h2>
          <span className={styles.sectionHint}>阶段 4 接入真实内容流</span>
        </div>

        <div className={styles.grid}>
          {placeholderCards.map((item) => (
            <Card key={item} hoverable>
              <div className={styles.cardBody}>
                <Skeleton lines={3} />
                <div className={styles.cardFoot}>
                  <Skeleton variant="circle" width={28} height={28} />
                  <Skeleton width="45%" height={12} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
