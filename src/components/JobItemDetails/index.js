import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getFormattedJobData = data => ({
    id: data.id,
    title: data.title,
    rating: data.rating,
    companyLogoUrl: data.company_logo_url,
    location: data.location,
    employmentType: data.employment_type,
    packagePerAnnum: data.package_per_annum,
    jobDescription: data.job_description,
    skills: Array.isArray(data.skills)
      ? data.skills.map(skill => ({
          name: skill.name,
          imageUrl: skill.image_url,
        }))
      : [],
    lifeAtCompany: data.life_at_company
      ? {
          description: data.life_at_company.description,
          imageUrl: data.life_at_company.image_url,
        }
      : {description: '', imageUrl: ''},
    companyWebsiteUrl: data.company_website_url || '',
  })

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const data = await response.json()
        const updatedJob = this.getFormattedJobData(data.job_details)
        const updatedSimilarJobs = Array.isArray(data.similar_jobs)
          ? data.similar_jobs.map(job => this.getFormattedJobData(job))
          : []
        this.setState({
          jobData: updatedJob,
          similarJobs: updatedSimilarJobs,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="job-details-loader" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="job-details-failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-btn" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderJobDetailsView = () => {
    const {jobData, similarJobs} = this.state
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      skills,
      lifeAtCompany,
      companyWebsiteUrl,
    } = jobData

    return (
      <div>
        <div className="job-details-success">
          {/* Header */}
          <div className="job-header">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-company-logo"
            />
            <div className="job-title-rating">
              <h1 className="job-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="job-meta">
            <div className="location-employment">
              <div className="location">
                <MdLocationOn className="icon" />
                <p>{location}</p>
              </div>
              <div className="employment-type">
                <BsBriefcaseFill className="icon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>

          <hr className="separator" />

          {/* Description */}
          <div className="description-section">
            <div className="description-header">
              <h2 className="description-heading">Description</h2>
              {companyWebsiteUrl && (
                <a
                  href={companyWebsiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="visit-link"
                >
                  Visit
                </a>
              )}
            </div>
            <p className="description">{jobDescription}</p>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="skills-section">
              <h2 className="section-heading">Skills</h2>
              <ul className="skills-list">
                {skills.map(skill => (
                  <li key={skill.name} className="skill-item">
                    <img
                      src={skill.imageUrl}
                      alt={skill.name}
                      className="skill-icon"
                    />
                    <p>{skill.name}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Life at Company */}
          {lifeAtCompany.description && (
            <div className="life-section">
              <h2 className="section-heading">Life at Company</h2>
              <div className="life-content">
                <p>{lifeAtCompany.description}</p>
                {lifeAtCompany.imageUrl && (
                  <img
                    src={lifeAtCompany.imageUrl}
                    alt="life at company"
                    className="life-image"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Similar Jobs */}
        {similarJobs.length > 0 && (
          <>
            <h2 className="section-heading">Similar Jobs</h2>
            <ul className="similar-jobs-list">
              {similarJobs.map(job => (
                <SimilarJobItem jobDetails={job} key={job.id} />
              ))}
            </ul>
          </>
        )}
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
