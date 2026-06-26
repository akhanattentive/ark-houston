import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Reveal } from './components/Reveal';
import { useLenis } from './lib/useLenis';
import { verses, mission, story, pillars } from './data/content';
import { ArchFrame } from './components/ArchFrame';
import './styles/sections.css';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  useLenis();
  const progressRef = useRef<HTMLDivElement>(null!);

  // thin progress meter at the top of the page
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (progressRef.current)
          progressRef.current.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <>
      {/* — chrome — */}
      <header className="topbar">
        <span className="wordmark">ARK</span>
        <nav className="topnav">
          <a href="#mission">Mission</a>
          <a href="#story">Story</a>
          <a href="#pillars">Practice</a>
        </nav>
        <span className="locale">Houston · TX</span>
      </header>
      <div className="progress-track">
        <div className="progress-bar" ref={progressRef} />
      </div>

      <main className="content">
        {/* ——— I. THE CALM ——— */}
        <section className="hero">
          <ArchFrame />
          <div className="hero-inner">
            <Reveal className="hero-verse" stagger delay={0.2}>
              <div className="arabic">{verses.bismillah.arabic}</div>
              <div className="translit">{verses.bismillah.translit}</div>
            </Reveal>

            <Reveal className="hero-title" stagger delay={0.45}>
              <span className="eyebrow">Art · Remembrance · Knowledge</span>
              <h1 className="display">ARK</h1>
              <p className="hero-sub">
                A Houston community translating tradition into the language of
                our time through art, expression, and devotion.
              </p>
            </Reveal>
          </div>

          <div className="scroll-cue">
            <span>Begin the journey</span>
            <span className="cue-line" />
          </div>
        </section>

        {/* ——— MISSION ——— */}
        <section className="act act-mission" id="mission">
          <Reveal className="block" stagger>
            <span className="eyebrow">Our Mission</span>
            <p className="lede display">{mission}</p>
          </Reveal>
        </section>

        {/* ——— V. STORY ——— */}
        <section className="act act-story" id="story">
          <Reveal className="act-head">
            <span className="eyebrow">Our Story</span>
            <h2 className="display">A Reminder for Our Future</h2>
          </Reveal>
          <Reveal className="story-grid" stagger>
            {story.map((p, i) => (
              <p key={i} className="story-para">
                {p}
              </p>
            ))}
          </Reveal>
        </section>

        {/* ——— VI. PRACTICE / PILLARS ——— */}
        <section className="act act-pillars" id="pillars">
          <Reveal className="act-head act-head--center">
            <span className="eyebrow">Our Practice</span>
            <h2 className="display">Three Movements</h2>
          </Reveal>
          <Reveal className="pillars" stagger>
            {pillars.map((p) => (
              <article key={p.n} className="pillar">
                <span className="pillar-n">{p.n}</span>
                <div className="pillar-ar arabic">{p.arabic}</div>
                <h3 className="pillar-title display">{p.title}</h3>
                <p className="pillar-body">{p.body}</p>
              </article>
            ))}
          </Reveal>
        </section>

        {/* ——— VII. THE RETURN ——— */}
        <footer className="act act-return">
          <Reveal className="return-block" stagger>
            <div className="arabic return-verse">{verses.returning.arabic}</div>
            <p className="return-translation">{verses.returning.translation}</p>
            <div className="rule" style={{ margin: '2rem auto' }} />
            <p className="return-tag">
              Art · Remembrance · Knowledge
            </p>
            <div className="return-foot">
              <span className="wordmark">ARK</span>
              <span>Houston · Texas</span>
              <span>المُلكُ لله</span>
            </div>
          </Reveal>
        </footer>
      </main>
    </>
  );
}
