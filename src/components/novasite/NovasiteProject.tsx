// Verbatim markup from the Novasite template (`full home .zip`): the `section project` block — Selected work.
// Only the runtime artefacts of the capture were removed — SplitText's per-letter
// divs, GSAP/IX2 inline styles and the widget state Webflow's runtime rebuilds.
// Styling comes from `src/styles/novasite.css`; motion from the Webflow IX2 runtime.
//
// The four cards are the template's, repeated over TITA's own projects instead
// of being hard-coded: the card image is the project thumbnail, the badge is the
// client's mark, and the chip carries the collection it belongs to.
import { homeProjects } from '@/data/projects'

export function NovasiteProject() {
  return (
    <section className="section project" id="project">
      <div className="w-layout-blockcontainer container w-container">
        <div className="project-showcase">
          <div className="sub-heading-content">
            <div className="overflow-hidden">
              <div className="sub-heading-block" data-w-id="f91fcfbf-612a-e5d0-9f3d-75fab3cec0e7">
                <h2 className="sub-heading">
                  Selected work
                </h2>
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="work-content-block" data-w-id="f91fcfbf-612a-e5d0-9f3d-75fab3cec0eb">
                <p className="para-1">
                  Twenty-six brands across five collections — Renaissance, Amplify, Compose, Ignite and Genesis.
                </p>
              </div>
            </div>
          </div>
          <div className="project-wrapper">
            <div className="project-list w-dyn-list">
              <div className="project-collection w-dyn-items" role="list">
                {homeProjects.map((project) => (
                  <div className="project-iteam w-dyn-item" role="listitem" key={project.slug}>
                    <a className="single-project-wrapper w-inline-block" data-w-id="e016cde7-18c5-3493-e9fb-78e15fc4bfb1" href={`/work/${project.slug}`}>
                      <img alt={project.title} className="project-card-img" data-w-id="88dc0acf-4c15-1934-5530-e17cb5f5048c" loading="lazy" src={project.thumbnail} />
                      <div className="project-card-mask">
                        <div className="category-year-wrapper">
                          <div className="category-bg">
                            <div className="category-name">
                              {project.collection}
                            </div>
                          </div>
                          <div className="year-wrap">
                            <div className="heading-2">
                              {project.title}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* The template floated a small client logo over the card
                          because its stock images carried no branding. TITA's
                          thumbnails already have the mark in them, so a second
                          copy just sat on top of the first. */}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
