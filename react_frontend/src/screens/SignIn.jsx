import React, { useEffect } from 'react';
import '../assets/common.css';
import '../assets/sign-in-11-235.css';

// PUBLIC_INTERFACE
export default function SignIn({ onNavigate }) {
  /** Render the Sign In screen converted from static HTML.
   *  Props:
   *   - onNavigate: function(route) to move to another screen within the app, e.g., 'signup' or 'home'
   */
  useEffect(() => {
    const signinForm = document.getElementById('signin-form');
    const forgotLink = document.getElementById('forgot-link');
    const signupLink = document.getElementById('signup-link');

    const onSubmit = (e) => {
      e.preventDefault();
      const email = (document.getElementById('email')?.value || '').trim();
      const password = (document.getElementById('password')?.value || '');

      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }
      alert('Sign In submitted:\n' + JSON.stringify({ email }, null, 2));
      if (onNavigate) onNavigate('home');
    };

    const onForgotClick = (e) => {
      e.preventDefault();
      alert('Navigate to Forgot Password (placeholder).');
    };

    const onSignupClick = (e) => {
      e.preventDefault();
      if (onNavigate) onNavigate('signup');
    };

    if (signinForm) signinForm.addEventListener('submit', onSubmit);
    if (forgotLink) forgotLink.addEventListener('click', onForgotClick);
    if (signupLink) signupLink.addEventListener('click', onSignupClick);

    return () => {
      if (signinForm) signinForm.removeEventListener('submit', onSubmit);
      if (forgotLink) forgotLink.removeEventListener('click', onForgotClick);
      if (signupLink) signupLink.removeEventListener('click', onSignupClick);
    };
  }, [onNavigate]);

  return (
    <main className="screen sign-in" role="main" aria-labelledby="title-hello">
      <div className="status-bar" aria-hidden="true">
        <div className="time">19:27</div>
        <div className="indicators">
          <div className="wifi"></div>
          <div className="cell"></div>
          <div className="battery"></div>
        </div>
      </div>

      <section className="title-group">
        <h1 id="title-hello" className="title">Hello,</h1>
        <p className="subtitle">Welcome Back!</p>
      </section>

      <form className="form" id="signin-form" noValidate>
        <div className="field">
          <label className="label" htmlFor="email">Email</label>
          <div className="input-wrap">
            <input id="email" name="email" type="email" placeholder="Enter Email" autoComplete="username" />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="password">Enter Password</label>
          <div className="input-wrap">
            <input id="password" name="password" type="password" placeholder="Enter Password" autoComplete="current-password" />
          </div>
        </div>

        <p className="forgot">
          <a href="#" id="forgot-link">Forgot Password?</a>
        </p>

        <button type="submit" className="btn cta" id="cta-signin">
          <span className="cta-label">Sign In</span>
          <span className="cta-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 10h12" stroke="#000" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M11 6l4 4-4 4" stroke="#000" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
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
                <path fill="#FFC107" d="M10 8.182h9.545C19.8 3.7 15.6 0 10 0 4.477 0 0 4.477 0 10c0 .992.145 1.949.414 2.85L10 8.182z"/>
                <path fill="#FF3D00" d="M0 10c0-3.73 2.21-6.94 5.41-8.35L10 8.18 0 10z" opacity="0"/>
                <path fill="#4CAF50" d="M10 11.818l6.873-6.873C18.13 6.245 20 8.96 20 12.273 20 16.692 16.692 20 12.273 20c-3.313 0-6.027-1.87-7.327-4.127L10 11.818z"/>
                <path fill="#1976D2" d="M4.946 15.873C3.646 13.615 3.308 10.9 4.414 8.182H10l-5.054 7.691z"/>
              </svg>
            </span>
          </button>
          <button type="button" className="social-btn facebook" aria-label="Sign in with Facebook" onClick={() => alert('Facebook sign-in clicked (placeholder).')}>
            <span className="icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="10" cy="10" r="10" fill="rgba(3,91,129,0.58)"></circle>
                <path d="M11.5 6.5h1.5V8h-1c-.6 0-1 .4-1 1v1h2l-.3 1.5H11V16H9.5v-4.5H8V10h1.5V8.8c0-1.27.73-2.3 2-2.3z" fill="#035b81"></path>
              </svg>
            </span>
          </button>
        </div>

        <p className="signup-link">
          <a href="#" id="signup-link">Don’t have an account? Sign up</a>
        </p>
      </form>

      <div className="home-indicator" aria-hidden="true"></div>
    </main>
  );
}
