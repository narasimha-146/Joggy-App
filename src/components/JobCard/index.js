import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobCard = props => {
  const {jobData} = props
  const {
    id,
    title,
    companyLogoUrl,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = jobData

  return (
    <li className="job-card">
      <Link to={`/jobs/${id}`} className="job-link">
        {/* Header */}
        <div className="job-header">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="job-title-rating">
            <h2 className="job-title">{title}</h2>
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
              <p className="meta-text">{location}</p>
            </div>
            <div className="employment-type">
              <BsBriefcaseFill className="icon" />
              <p className="meta-text">{employmentType}</p>
            </div>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>

        <hr className="separator" />

        {/* Description */}
        <div className="job-description">
          <h3 className="description-heading">Description</h3>
          <p className="description">{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}

export default JobCard
