// Verbatim markup from the Novasite template (`full home .zip`): the `section contact` block — Let’s Talk and the contact form.
// Only the runtime artefacts of the capture were removed — SplitText's per-letter
// divs, GSAP/IX2 inline styles and the widget state Webflow's runtime rebuilds.
// Styling comes from `src/styles/novasite.css`; motion from the Webflow IX2 runtime.
export function NovasiteContact() {
  return (
    <section className="section contact" id="contact">
      <div className="w-layout-blockcontainer container w-container">
        <div className="contact-main-wrapper">
          <div className="conatct-left-content">
            <div className="overflow-hidden">
              <div className="conact-left-content-wrapper">
                <h2 className="sub-heading" data-w-id="37694d13-ad67-21f5-ef1f-c6ccc0b01590">
                  Let’s Talk
                </h2>
                <div className="contact-para-user-block">
                  <div className="contact-para" data-w-id="f99e6785-5a11-b344-eb74-33a1e2f0a084">
                    Have something in mind? Tell us where the brand is now and where it should be.
                  </div>
                  <div className="user-block">
                    <img alt="" className="user-img" data-w-id="1d0de61a-a5ab-4b9f-920f-d541428ae4cf" loading="lazy" src="/novasite/contact-user.webp" />
                    <div className="user-name-tag">
                      <div className="user-name" data-w-id="9c299e6d-fe41-1be7-0aa3-e0363406c7a0">
                        Naamdasi Patel
                      </div>
                      <div className="user-tag" data-w-id="bc2dcd0a-62e3-7035-cf73-cc44018341ea">
                        Co-Founder
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-right-content">
            <div className="contact-right-content-wrapper">
              <div className="contact-form-block w-form">
                <form aria-label="Main Contact Form" className="contact-form" data-name="Main Contact Form" id="wf-form-Main-Contact-Form" method="get" name="wf-form-Main-Contact-Form">
                  <input className="contact-text-field w-input" data-name="Name" data-w-id="3a6ef016-43ca-f879-2d82-fd47d83177cc" id="name" maxLength={256} name="name" placeholder="Your Name*" required type="text" />
                  <input className="contact-text-field w-input" data-name="Email" data-w-id="ce92e9f1-3667-5df1-7a4d-2031bafee6f3" id="email" maxLength={256} name="email" placeholder="Your Email*" required type="email" />
                  <textarea className="contact-text-field message w-input" data-name="Field" data-w-id="16346cfa-545a-2d62-41f5-317358fb7d8e" id="field" maxLength={5000} name="field" placeholder="Your Message*" required></textarea>
                  <input className="contact-submit-button w-button" data-w-id="3a6ef016-43ca-f879-2d82-fd47d83177d0" data-wait="" type="submit" value="Contact" />
                  {/* The template's captcha slot. It is left empty — the stale
                      Turnstile token from the capture is gone and no challenge
                      is loaded — but it stays in the tree because `.contact-form`
                      is a flex column and this is one of its gapped children. */}
                  <div>
                    <div>
                      <div></div>
                    </div>
                  </div>
                </form>
                <div className="success-message w-form-done" role="region" tabIndex={-1}>
                  <div className="success-message-text">
                    Thank you! Your submission has been received!
                  </div>
                </div>
                <div className="error-message w-form-fail" role="region" tabIndex={-1}>
                  <div className="error-message-text">
                    Oops! Something went wrong while submitting the form.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
