import React, { useEffect } from 'react';
import '../assets/common.css';
import '../assets/sign-up-30-403.css';

// PUBLIC_INTERFACE
export default function SignUp({ onNavigate }) {
  /** Render the Sign Up screen converted from static HTML.
   *  Props:
   *   - onNavigate: function(route) to move to another screen within the app, e.g., 'signin'
   */
  useEffect(() => {
    // Minimal behaviors adapted from assets/app.js
    const terms = document.getElementById('terms');
    const cta = document.getElementById('cta');
    const signupForm = document.getElementById('signup-form');
    const signinLink = document.getElementById('signin-link');

    const updateCta = () => {
      if (cta && terms) cta.disabled = !terms.checked;
    };

    if (terms) {
      terms.addEventListener('change', updateCta);
      updateCta();
    }

    const onSubmit = (e) => {
      e.preventDefault();
      if (cta && cta.disabled) return;

      const name = (document.getElementById('name')?.value || '').trim();
      const email = (document.getElementById('email')?.value || '').trim();
      const password = (document.getElementById('password')?.value || '');
      const confirm = (document.getElementById('confirm')?.value || '');

      if (!name || !email || !password || password !== confirm || !terms?.checked) {
        alert('Please complete all fields correctly and accept the terms.');
        return;
      }

      alert('Sign Up submitted:\n' + JSON.stringify({ name, email }, null, 2));
      // Navigate to home preview after sign up (optional UX)
      if (onNavigate) onNavigate('home');
    };

    if (signupForm) {
      signupForm.addEventListener('submit', onSubmit);
    }

    const onSigninClick = (e) => {
      e.preventDefault();
      if (onNavigate) onNavigate('signin');
    };

    if (signinLink) {
      signinLink.addEventListener('click', onSigninClick);
    }

    return () => {
      if (terms) terms.removeEventListener('change', updateCta);
      if (signupForm) signupForm.removeEventListener('submit', onSubmit);
      if (signinLink) signinLink.removeEventListener('click', onSigninClick);
    };
  }, [onNavigate]);

  return (
    <main className="screen sign-up" role="main" aria-labelledby="title-text">
      {/* Status Bar */}
      <div className="status-bar" aria-hidden="true">
        <div className="time">19:27</div>
        <div className="indicators">
          <div className="wifi"></div>
          <div className="cell"></div>
          <div className="battery"></div>
        </div>
      </div>

      <section className="title-group">
        <h1 id="title-text" className="title">Create an account</h1>
        <p className="subtitle">Let’s help you set up your account, it won’t take long.</p>
      </section>

      <form className="form" id="signup-form" noValidate>
        <div className="field">
          <label className="label" htmlFor="name">Name</label>
          <div className="input-wrap">
            <input id="name" name="name" type="text" placeholder="Enter Name" />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="email">Email</label>
          <div className="input-wrap">
            <input id="email" name="email" type="email" placeholder="Enter Email" />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="password">Password</label>
          <div className="input-wrap">
            <input id="password" name="password" type="password" placeholder="Enter Password" />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="confirm">Confirm Password</label>
          <div className="input-wrap">
            <input id="confirm" name="confirm" type="password" placeholder="Retype Password" />
          </div>
        </div>

        <div className="terms">
          <label className="checkbox">
            <input type="checkbox" id="terms" />
            <span className="custom-box" aria-hidden="true"></span>
            <span className="checkbox-label">Accept terms &amp; Condition</span>
          </label>
        </div>

        <button type="submit" className="btn cta" id="cta" disabled>
          <span className="cta-label">Sign Up</span>
          <span className="cta-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 10h12" stroke="#000" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M11 6l4 4-4 4" stroke="#000" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        <div className="or-line" aria-hidden="true">
          <span className="line left"></span>
          <span className="or-text">Or Sign in With</span>
          <span className="line right"></span>
        </div>

        <div className="social">
          <button type="button" className="social-btn google" aria-label="Sign in with Google" onClick={() => alert('Google sign-in clicked (placeholder).')}>
            <span className="icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <path fill="#ffc107" d="M10 8.181h9.545C19.8 3.7 15.6 0 10 0 4.477 0 0 4.477 0 10c0 .992.145 1.949.414 2.85L10 8.18z" />
                <path fill="#ff3d00" d="M10 8.181H0C.94 3.527 5.021 0 10 0c2.7 0 5.15 1.04 7.01 2.735L10 8.181z" opacity="0" />
                <path fill="#4caf50" d="M10 11.82l6.873-6.873C18.13 6.246 20 8.96 20 12.273 20 16.692 16.692 20 12.273 20c-3.313 0-6.027-1.87-7.327-4.127L10 11.82z" />
                <path fill="#1976d2" d="M4.946 15.873C3.646 13.615 3.308 10.9 4.414 8.18H10l-5.054 7.693z" />
              </svg>
            </span>
          </button>
          <button type="button" className="social-btn facebook" aria-label="Sign in with Facebook" onClick={() => alert('Facebook sign-in clicked (placeholder).')}>
            <span className="icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="10" cy="10" r="10" fill="rgba(3,91,129,0.58)"></circle>
                <path d="M11.5 6.5h1.5V8h-1c-.6 0-1 .4-1 1v1h2l-.3 1.5H11.0V16H9.5v-4.5H8V10h1.5V8.8c0-1.27.73-2.3 2-2.3z" fill="#035b81"></path>
              </svg>
            </span>
          </button>
        </div>

        <p className="signin-link">
          <a href="#" id="signin-link">Already a member? Sign In</a>
        </p>
      </form>

      <div className="home-indicator" aria-hidden="true"></div>
    </main>
  );
}
