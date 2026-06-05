import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Helmet } from 'react-helmet-async'
import { useGsapReveal } from '../../hooks/useGsapReveal'
import heroImage from '../../../assets/images/about/yo-mpas-about.jpg'
import img1 from '../../../assets/images/about/y-a.jpg'
import img2 from '../../../assets/images/about/y-a1.jpg'
import img3 from '../../../assets/images/about/y-a2.jpg'
import img4 from '../../../assets/images/about/y-a3.jpg'
import img5 from '../../../assets/images/about/y-a5.jpg'
import img6 from '../../../assets/images/about/y-record.jpg'
import img8 from '../../../assets/images/about/yomaps1.jpg'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger, Flip, useGSAP)

const GALLERY_IMAGES = [img1, img2, img3, img4, img5, img6, heroImage, img8]

const TIMELINE = [
  { year: '2016', event: 'First single "Njikata Kuboko" released — Zambia takes notice' },
  { year: '2018', event: '"Finally" ft. Macky 2 breaks through, earning national airplay' },
  { year: '2019', event: 'Komando album drops — establishes Yo Maps as a headliner' },
  { year: '2021', event: 'My Hero album released, featuring "Mr Romantic"' },
  { year: '2022', event: '"Mr Romantic" crosses 100M+ streams on Boomplay — first Zambian in the Golden Club' },
  { year: '2023', event: 'Sells out Heroes Stadium, Lusaka — 50,000 fans' },
  { year: '2025', event: 'AFRIMA Award — Best Male Artist in Southern Africa' },
  { year: '2025', event: 'Vibes on Vibes album with Makhadzi, Harmonize, and Rotimi' }
]

export default function About() {
  const heroRef = useRef(null)
  const timelineRef = useRef(null)
  const galleryWrapRef = useRef(null)
  const missionRef = useGsapReveal({ delay: 0.1 })

  useGSAP(() => {
    if (!galleryWrapRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let flipCtx
    const galleryElement = galleryWrapRef.current.querySelector(`.${styles.gallery}`)
    const galleryItems = galleryElement.querySelectorAll(`.${styles.galleryItem}`)

    const createTween = () => {
      if (flipCtx) flipCtx.revert()
      galleryElement.classList.remove(styles.galleryFinal)

      flipCtx = gsap.context(() => {
        galleryElement.classList.add(styles.galleryFinal)
        const flipState = Flip.getState(galleryItems)
        galleryElement.classList.remove(styles.galleryFinal)

        const flip = Flip.to(flipState, {
          simple: true,
          ease: "expoScale(1, 5)"
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: galleryElement,
            start: "center center",
            end: "+=100%",
            scrub: true,
            pin: galleryWrapRef.current
          }
        })
        tl.add(flip)
        return () => gsap.set(galleryItems, { clearProps: "all" })
      })
    }

    createTween()
    window.addEventListener("resize", createTween)
    return () => window.removeEventListener("resize", createTween)
  }, { scope: galleryWrapRef })

  useEffect(() => {
    if (!heroRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current.querySelectorAll('h1, p'),
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.2 }
      )
      const img = heroRef.current.querySelector('img')
      if (img) {
        gsap.fromTo(img,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out', delay: 0.15 }
        )
      }
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!timelineRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      timelineRef.current.querySelectorAll('[data-timeline-item]').forEach((item) => {
        gsap.fromTo(item,
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 88%' } }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className={styles.page}>
      <Helmet>
        <title>About Yo Maps — Official Store</title>
        <meta name="description" content="The story of Elton Mulenga, Zambia's most-streamed artist and 2025 AFRIMA Award winner." />
      </Helmet>

      <div ref={galleryWrapRef} className={styles.galleryWrap}>
        <div className={`${styles.gallery} ${styles.galleryBento}`} id="gallery-8">
          {GALLERY_IMAGES.map((src, i) => (
            <div key={i} className={styles.galleryItem}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </div>

      <section ref={heroRef} className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Elton Mulenga · Kasama, Zambia</p>
          <h1 className={styles.title}>The Artist<br />Behind the Vibe</h1>
          <p className={styles.bio}>
            Born in Kasama and raised on Zambian music, Elton Mulenga — known to the continent as Yo Maps —
            built his career song by song, stadium by stadium. Signed to Olios Records, his sound blends
            Afropop, R&B, and Zambian soul into something that crosses every border.
            The numbers confirm what fans already knew: 100 million streams, a Heroes Stadium sellout,
            and the 2025 AFRIMA for Best Male Artist in Southern Africa.
          </p>
        </div>
      </section>

      <section className={styles.timelineSection}>
        <h2 className={styles.sectionTitle}>The Journey</h2>
        <div ref={timelineRef} className={styles.timeline}>
          <div className={styles.timelineLine} aria-hidden="true" />
          {TIMELINE.map(({ year, event }, i) => (
            <div key={i} data-timeline-item className={styles.timelineItem}>
              <span className={styles.timelineYear}>{year}</span>
              <div className={styles.timelineDot} aria-hidden="true" />
              <p className={styles.timelineEvent}>{event}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.mission}>
        <div ref={missionRef} className={styles.missionInner}>
          <p className={styles.missionQuote}>
            "Every item is a piece of the journey."
          </p>
          <p className={styles.missionAttrib}>— Yo Maps</p>
        </div>
      </section>
    </div>
  )
}
