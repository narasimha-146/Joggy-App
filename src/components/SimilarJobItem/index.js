import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    jobDescription,
  } = jobDetails

  return (
    <li className="similar-job-item">
      <div className="similar-job-header">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-job-logo"
        />
        <div className="similar-job-title-rating">
          <h1 className="similar-job-title">{title}</h1>
          <div className="rating-container">
            <AiFillStar className="star-icon" />
            <p className="rating">{rating}</p>
          </div>
        </div>
      </div>

      <h1 className="section-heading">Description</h1>
      <p className="description">{jobDescription}</p>

      <div className="similar-job-meta">
        <div className="location">
          <MdLocationOn className="icon" />
          <p>{location}</p>
        </div>
        <div className="employment-type">
          <BsBriefcaseFill className="icon" />
          <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem
