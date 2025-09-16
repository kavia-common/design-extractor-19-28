import React, { useEffect } from 'react';
import '../assets/common.css';
import '../assets/home-17-80.css';

// PUBLIC_INTERFACE
export default function Home() {
  /** Render the Home screen converted from static HTML.
   *  This is a static preview UI; images are placeholder surfaces styled by CSS.
   */
  useEffect(() => {
    // Behaviors from assets/app.js relevant to Home
    const chipEls = Array.from(document.querySelectorAll('.chips .chip'));
    chipEls.forEach((chip) => {
      const onClick = () => {
        chipEls.forEach((c) => c.classList.remove('chip--active'));
        chip.classList.add('chip--active');
        alert('Filter by: ' + (chip.dataset.chip || chip.textContent));
      };
      chip.addEventListener('click', onClick);
    });

    const filterBtn = document.getElementById('filter-btn');
    const onFilter = () => alert('Open filter (placeholder).');
    if (filterBtn) filterBtn.addEventListener('click', onFilter);

    const bookmarks = Array.from(document.querySelectorAll('.popular-card .bookmark'));
    const onBookmark = (btn) => () => {
      btn.classList.toggle('active');
      if (btn.classList.contains('active')) {
        btn.style.background = 'var(--color-71b1a1)';
      } else {
        btn.style.background = 'var(--color-ffffff)';
      }
    };
    bookmarks.forEach((btn) => btn.addEventListener('click', onBookmark(btn)));

    return () => {
      chipEls.forEach((chip) => chip.replaceWith(chip.cloneNode(true)));
      if (filterBtn) filterBtn.removeEventListener('click', onFilter);
      bookmarks.forEach((btn) => btn.replaceWith(btn.cloneNode(true)));
    };
  }, []);

  return (
    <main className="screen home" role="main" aria-labelledby="greeting-title">
      <div className="status-bar" aria-hidden="true">
        <div className="time">19:27</div>
        <div className="indicators">
          <div className="wifi"></div>
          <div className="cell"></div>
          <div className="battery"></div>
        </div>
      </div>

      <header className="header">
        <div className="title-block">
          <h1 id="greeting-title" className="greeting-title">Hello Jega</h1>
          <p className="greeting-subtitle">What are you cooking today?</p>
        </div>
        <button className="avatar-btn" type="button" aria-label="Open profile">
          <span className="avatar" aria-hidden="true"></span>
        </button>

        <div className="search-filter-row">
          <div className="search" role="search">
            <span className="search-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="#d9d9d9" strokeWidth="1.3" fill="none"></circle>
                <path d="M13.5 13.5l3 3" stroke="#d9d9d9" strokeWidth="1.3" strokeLinecap="round"></path>
              </svg>
            </span>
            <input type="text" id="search" placeholder="Search recipe" aria-label="Search recipe" />
          </div>
          <button className="btn filter-btn" id="filter-btn" type="button" aria-label="Open filter options">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M12.5 6.5h4.5M3 6.5h7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="11" cy="6.5" r="1.5" fill="#ffffff"/>
              <path d="M7.5 13.5h9.5M3 13.5h2" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="5" cy="13.5" r="1.5" fill="#ffffff"/>
            </svg>
          </button>
        </div>

        <nav className="chips" aria-label="Categories">
          <button className="chip chip--active" data-chip="All" type="button" aria-pressed="true">All</button>
          <button className="chip" data-chip="Indian" type="button" aria-pressed="false">Indian</button>
          <button className="chip" data-chip="Italian" type="button" aria-pressed="false">Italian</button>
          <button className="chip" data-chip="Asian" type="button" aria-pressed="false">Asian</button>
          <button className="chip" data-chip="Chinese" type="button" aria-pressed="false">Chinese</button>
          <button className="chip" data-chip="Fruit" type="button" aria-pressed="false">Fruit</button>
          <button className="chip" data-chip="Vegetables" type="button" aria-pressed="false">Vegetables</button>
          <button className="chip" data-chip="Protein" type="button" aria-pressed="false">Protein</button>
          <button className="chip" data-chip="Cereal" type="button" aria-pressed="false">Cereal</button>
          <button className="chip" data-chip="Local Dishes" type="button" aria-pressed="false">Local Dishes</button>
        </nav>
      </header>

      <h2 className="section-title">New Recipes</h2>

      <section className="new-recipes" aria-label="New Recipes">
        <div className="recipe-row">
          <article className="recipe-card">
            <div className="card-media"><div className="thumb" role="img" aria-label="Recipe image placeholder"></div></div>
            <div className="card-body">
              <h3 className="card-title">Steak with tomato sauce and bulgur rice.</h3>
              <div className="meta-row">
                <div className="timer"><span className="timer-icon" aria-hidden="true"></span><span className="timer-text">20 mins</span></div>
                <div className="creator">By James Milner</div>
              </div>
              <div className="rating" aria-label="Rating 5 out of 5">
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
              </div>
            </div>
          </article>

          <article className="recipe-card">
            <div className="card-media"><div className="thumb" role="img" aria-label="Recipe image placeholder"></div></div>
            <div className="card-body">
              <h3 className="card-title">Pilaf sweet with lamb-and-raisins</h3>
              <div className="meta-row">
                <div className="timer"><span className="timer-icon" aria-hidden="true"></span><span className="timer-text">20 mins</span></div>
                <div className="creator">By Laura wilson</div>
              </div>
              <div className="rating" aria-label="Rating 5 out of 5">
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
              </div>
            </div>
          </article>

          <article className="recipe-card">
            <div className="card-media"><div className="thumb" role="img" aria-label="Recipe image placeholder"></div></div>
            <div className="card-body">
              <h3 className="card-title">Rice Pilaf, Broccoli and Chicken</h3>
              <div className="meta-row">
                <div className="timer"><span className="timer-icon" aria-hidden="true"></span><span className="timer-text">20 mins</span></div>
                <div className="creator">By Lucas Moura</div>
              </div>
              <div className="rating" aria-label="Rating 5 out of 5">
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
              </div>
            </div>
          </article>

          <article className="recipe-card">
            <div className="card-media"><div className="thumb" role="img" aria-label="Recipe image placeholder"></div></div>
            <div className="card-body">
              <h3 className="card-title">Chicken meal with sauce</h3>
              <div className="meta-row">
                <div className="timer"><span className="timer-icon" aria-hidden="true"></span><span className="timer-text">20 mins</span></div>
                <div className="creator">By Issabella Ethan</div>
              </div>
              <div className="rating" aria-label="Rating 5 out of 5">
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
              </div>
            </div>
          </article>

          <article className="recipe-card">
            <div className="card-media"><div className="thumb" role="img" aria-label="Recipe image placeholder"></div></div>
            <div className="card-body">
              <h3 className="card-title">Stir-fry chicken with broccoli in sweet and sour sauce and rice.</h3>
              <div className="meta-row">
                <div className="timer"><span className="timer-icon" aria-hidden="true"></span><span className="timer-text">20 mins</span></div>
                <div className="creator">By Miquel Ferran</div>
              </div>
              <div className="rating" aria-label="Rating 5 out of 5">
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
                <span className="star" aria-hidden="true"></span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="popular" aria-label="Popular Dishes">
        <div className="carousel">
          <article className="popular-card">
            <div className="image" role="img" aria-label="Dish image placeholder"></div>
            <button className="bookmark" type="button" aria-label="Save recipe"></button>
            <div className="info">
              <div className="pill rating-pill">
                <span className="star tiny" aria-hidden="true"></span>
                <span className="rating-text">4.5</span>
              </div>
              <div className="time">
                <span className="label">Time</span>
                <span className="value">15 Mins</span>
              </div>
              <h3 className="title">Classic Greek Salad</h3>
            </div>
          </article>

          <article className="popular-card">
            <div className="image" role="img" aria-label="Dish image placeholder"></div>
            <button className="bookmark" type="button" aria-label="Save recipe"></button>
            <div className="info">
              <div className="pill rating-pill">
                <span className="star tiny" aria-hidden="true"></span>
                <span className="rating-text">3.5</span>
              </div>
              <div className="time">
                <span className="label">Time</span>
                <span className="value">10 Mins</span>
              </div>
              <h3 className="title">Crunchy Nut Coleslaw</h3>
            </div>
          </article>

          <article className="popular-card">
            <div className="image" role="img" aria-label="Dish image placeholder"></div>
            <button className="bookmark" type="button" aria-label="Save recipe"></button>
            <div className="info">
              <div className="pill rating-pill">
                <span className="star tiny" aria-hidden="true"></span>
                <span className="rating-text">3.0</span>
              </div>
              <div className="time">
                <span className="label">Time</span>
                <span className="value">10 Mins</span>
              </div>
              <h3 className="title">Shrimp Chicken Andouille Sausage Jambalaya</h3>
            </div>
          </article>

          <article className="popular-card">
            <div className="image" role="img" aria-label="Dish image placeholder"></div>
            <button className="bookmark" type="button" aria-label="Save recipe"></button>
            <div className="info">
              <div className="pill rating-pill">
                <span className="star tiny" aria-hidden="true"></span>
                <span className="rating-text">4.5</span>
              </div>
              <div className="time">
                <span className="label">Time</span>
                <span className="value">10 Mins</span>
              </div>
              <h3 className="title">Barbecue Chicken Jollof Rice</h3>
            </div>
          </article>

          <article className="popular-card">
            <div className="image" role="img" aria-label="Dish image placeholder"></div>
            <button className="bookmark" type="button" aria-label="Save recipe"></button>
            <div className="info">
              <div className="pill rating-pill">
                <span className="star tiny" aria-hidden="true"></span>
                <span className="rating-text">4.5</span>
              </div>
              <div className="time">
                <span className="label">Time</span>
                <span className="value">10 Mins</span>
              </div>
              <h3 className="title">Portuguese Piri Piri Chicken</h3>
            </div>
          </article>
        </div>
      </section>

      <nav className="bottom-nav" aria-label="Bottom navigation">
        <button className="nav-btn nav-home" aria-label="Home" aria-current="page"></button>
        <button className="nav-btn nav-bookmark" aria-label="Bookmarks"></button>
        <button className="nav-btn nav-bell" aria-label="Notifications"></button>
        <button className="nav-btn nav-profile" aria-label="Profile"></button>
      </nav>

      <div className="home-indicator" aria-hidden="true"></div>
    </main>
  );
}
