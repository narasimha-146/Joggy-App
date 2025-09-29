// JobsListSection/index.js
import Loader from 'react-loader-spinner'
import JobCard from '../JobCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  noJobs: 'NO_JOBS',
}

const JobsListSection = props => {
  const {jobsList, jobsStatus, onRetry} = props

  const renderLoadingView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  const renderFailureView = () => (
    <div className="jobs-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-btn" onClick={onRetry}>
        Retry Jobs
      </button>
    </div>
  )

  const renderNoJobsView = () => (
    <div className="no-jobs-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-img"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-desc">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  const renderJobsList = () => (
    <ul className="jobs-list">
      {jobsList.map(each => (
        <JobCard key={each.id} jobData={each} />
      ))}
    </ul>
  )

  const renderJobsContent = () => {
    switch (jobsStatus) {
      case apiStatusConstants.success:
        return renderJobsList()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.noJobs:
        return renderNoJobsView()
      default:
        return null
    }
  }

  return <div className="jobs-list-section">{renderJobsContent()}</div>
}

export default JobsListSection
