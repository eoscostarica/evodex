import ReactGA from 'react-ga'

export const InitGA = () => {
  console.log('GA started!')
  ReactGA.initialize('UA-157283582-4')
}

export const LogPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}
