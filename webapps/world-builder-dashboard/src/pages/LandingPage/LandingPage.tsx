// LandingPage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LandingPage.module.css'
import { useMediaQuery } from 'summon-ui/mantine'
import AlliesSection from '@/components/landing/AlliesSection'
import BenefitsSection from '@/components/landing/BenefitsSection'
import Container from '@/components/landing/Container'
import MainSection from '@/components/landing/MainSection'
import Navbar from '@/components/landing/Navbar'
import NetworkEssentials from '@/components/landing/NetworksEssentials'
import { useBlockchainContext } from '@/contexts/BlockchainContext'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { setSelectedNetworkType } = useBlockchainContext()
  const [navbarOpen, setNavBarOpen] = useState<boolean>(false)
  const smallView = useMediaQuery('(max-width: 750px)')
  const isLargeView = useMediaQuery('(min-width: 1440px)')

  const startBuilding = () => {
    setSelectedNetworkType('Testnet')
    navigate('/faucet')
  }

  const navigateLink = (item: any) => {
    if (item.name === 'Faucet') {
      setSelectedNetworkType('Testnet')
      navigate(`/${item.link}`)
    } else if (item.name === "Bridge") {
      setSelectedNetworkType('Mainnet')
      navigate(`/${item.link}`)
    } else {
      window.open(item.link, '_blank')
    }
  }

  const slides = [
    <MainSection key='main' smallView={!!smallView} startBuilding={startBuilding} />,
    <BenefitsSection key='benefits' />,
    <AlliesSection key='allies' />,
    <NetworkEssentials smallView={!!smallView} startBuilding={startBuilding} key='essentials' />
  ]

  return (
    <>
      {isLargeView ? (
        <Container
          components={slides}
          isNavbarOpen={navbarOpen}
          setIsNavbarOpen={setNavBarOpen}
          isSmallView={!!smallView}
          startBuilding={startBuilding}
          navigateLink={navigateLink}
        />
      ) : (
        <div className={`${styles.layout} ${navbarOpen && styles.layoutBlur}`}>
          <Navbar
            navbarOpen={navbarOpen}
            smallView={!!smallView}
            setIsNavbarOpen={setNavBarOpen}
            startBuilding={startBuilding}
            navigateLink={navigateLink}
          />

          <div className={`${styles.mainLayout} ${navbarOpen ? styles.layoutDarkened : ''}`}>
            <MainSection smallView={!!smallView} startBuilding={startBuilding} />
            <BenefitsSection />
            <AlliesSection />
            <NetworkEssentials smallView={!!smallView} startBuilding={startBuilding} />
          </div>

          {smallView && (
            <div className={styles.startBuildingCTA} onClick={startBuilding}>
              Start Building
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default LandingPage
