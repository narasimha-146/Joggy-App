// Jobs/index.js

import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import ProfileSection from '../ProfileSection'
import JobsListSection from '../JobsListSection'
import './index.css'

// =========================
// Filter Constants
// =========================
const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  noJobs: 'NO_JOBS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    jobsStatus: apiStatusConstants.initial,
    selectedEmploymentTypes: [],
    selectedSalaryRange: '',
    searchInput: '',
    appliedSearch: '',
  }

  componentDidMount() {
    this.getJobs()
  }

  // =========================
  // API Call
  // =========================
  getJobs = async () => {
    this.setState({jobsStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {
      selectedEmploymentTypes,
      selectedSalaryRange,
      appliedSearch,
    } = this.state

    const employmentParam = selectedEmploymentTypes.join(',')
    const salaryParam = selectedSalaryRange
    const searchParam = appliedSearch

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentParam}&minimum_package=${salaryParam}&search=${searchParam}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const data = await response.json()
        if (data.jobs.length === 0) {
          this.setState({jobsStatus: apiStatusConstants.noJobs})
        } else {
          const updatedJobs = data.jobs.map(each => ({
            id: each.id,
            title: each.title,
            rating: each.rating,
            location: each.location,
            employmentType: each.employment_type,
            packagePerAnnum: each.package_per_annum,
            jobDescription: each.job_description,
            companyLogoUrl: each.company_logo_url,
          }))
          this.setState({
            jobsList: updatedJobs,
            jobsStatus: apiStatusConstants.success,
          })
        }
      } else {
        this.setState({jobsStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({jobsStatus: apiStatusConstants.failure})
    }
  }

  // =========================
  // Handlers
  // =========================
  onChangeEmploymentType = event => {
    const {value} = event.target
    this.setState(prevState => {
      if (prevState.selectedEmploymentTypes.includes(value)) {
        return {
          selectedEmploymentTypes: prevState.selectedEmploymentTypes.filter(
            each => each !== value,
          ),
        }
      }
      return {
        selectedEmploymentTypes: [...prevState.selectedEmploymentTypes, value],
      }
    }, this.getJobs)
  }

  onChangeSalaryRange = event => {
    this.setState({selectedSalaryRange: event.target.value}, this.getJobs)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    const {searchInput} = this.state
    this.setState({appliedSearch: searchInput}, this.getJobs)
  }

  clearFilters = () => {
    this.setState(
      {
        selectedEmploymentTypes: [],
        selectedSalaryRange: '',
      },
      this.getJobs,
    )
  }

  // =========================
  // Render Filters
  // =========================
  renderEmploymentTypes = () => (
    <div className="filter-group">
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="filter-list">
        {employmentTypesList.map(type => (
          <li key={type.employmentTypeId}>
            <input
              type="checkbox"
              id={type.employmentTypeId}
              value={type.employmentTypeId}
              onChange={this.onChangeEmploymentType}
            />
            <label htmlFor={type.employmentTypeId}>{type.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderSalaryRanges = () => (
    <div className="filter-group">
      <h1 className="filter-heading">Salary Range</h1>
      <ul className="filter-list">
        {salaryRangesList.map(range => (
          <li key={range.salaryRangeId}>
            <input
              type="radio"
              id={range.salaryRangeId}
              name="salary"
              value={range.salaryRangeId}
              onChange={this.onChangeSalaryRange}
            />
            <label htmlFor={range.salaryRangeId}>{range.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  // =========================
  // Render
  // =========================
  render() {
    const {searchInput, jobsList, jobsStatus} = this.state

    return (
      <>
        <Header />
        <div className="jobs-container">
          {/* Mobile Layout */}
          <div className="jobs-mobile-view">
            <div className="search-bar-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn"
                onClick={this.onClickSearch}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>

            <ProfileSection />
            {this.renderEmploymentTypes()}
            {this.renderSalaryRanges()}

            <JobsListSection
              jobsList={jobsList}
              jobsStatus={jobsStatus}
              onRetry={this.getJobs}
            />
          </div>

          {/* Desktop Layout */}
          <div className="jobs-desktop-view">
            <aside className="left-section">
              <ProfileSection />
              {this.renderEmploymentTypes()}
              {this.renderSalaryRanges()}
            </aside>
            <main className="right-section">
              <div className="search-bar-container">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search"
                  value={searchInput}
                  onChange={this.onChangeSearchInput}
                />
                <button
                  type="button"
                  data-testid="searchButton"
                  className="search-btn"
                  onClick={this.onClickSearch}
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>

              <JobsListSection
                jobsList={jobsList}
                jobsStatus={jobsStatus}
                onRetry={this.getJobs}
              />
            </main>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
