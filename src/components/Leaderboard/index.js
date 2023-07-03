import {useState, useEffect} from 'react'

import Loader from 'react-loader-spinner'

import LeaderboardTable from '../LeaderboardTable'

import {
  LeaderboardContainer,
  ErrorMessage,
  LoadingViewContainer,
} from './styledComponents'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

const Leaderboard = () => {
  console.log('component rendered')
  const [switchStatus, statusChangingFunction] = useState({
    data: '',
    errorMsg: '',
    status: apiStatus.initial,
  })

  useEffect(() => {
    const getData = async () => {
      statusChangingFunction(prevState => ({
        ...prevState,
        data: '',
        errorMsg: '',
        status: apiStatus.loading,
      }))
      const url = 'https://apis.ccbp.in/leaderboard'
      const options = {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU',
        },
      }
      const response = await fetch(url, options)
      const responseData = await response.json()
      if (response.ok) {
        statusChangingFunction(prevState => ({
          ...prevState,
          data: responseData,
          errorMsg: '',
          status: apiStatus.success,
        }))
      } else {
        statusChangingFunction(prevState => ({
          ...prevState,
          data: '',
          errorMsg: responseData,
          status: apiStatus.failure,
        }))
      }
    }
    getData()
  }, [])

  const renderSuccessView = () => {
    const {data} = switchStatus
    const newData = {data: data.leaderboard_data}
    const changedData = newData.data.map(each => ({
      id: each.id,
      rank: each.rank,
      name: each.name,
      profileImgUrl: each.profile_image_url,
      score: each.score,
      language: each.language,
      timeSpent: each.time_spent,
    }))
    return <LeaderboardTable leaderboardData={changedData} />
  }

  const renderFailureView = () => {
    const {errorMsg} = switchStatus

    return <ErrorMessage>{errorMsg}</ErrorMessage>
  }

  const renderLoadingView = () => (
    <LoadingViewContainer>
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </LoadingViewContainer>
  )

  const renderLeaderboard = () => {
    const {status} = switchStatus
    console.log(status)
    switch (status) {
      case 'SUCCESS':
        return renderSuccessView()
      case 'FAILURE':
        return renderFailureView()
      default:
        return renderLoadingView()
    }
  }

  return <LeaderboardContainer>{renderLeaderboard()}</LeaderboardContainer>
}

export default Leaderboard
