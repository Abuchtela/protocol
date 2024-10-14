import React, { useEffect, useState } from 'react'
import styles from './LandingPage.module.css'
import IconGame7 from '@/assets/IconGame7'
import IconGame7Logo from '@/assets/IconGame7Logo'
import { useNavigate } from 'react-router-dom'
import HyperPlayLogo from '@/assets/HyperPlayLogo'
import SummonLogo from '@/assets/SummonLogo'
import SummonTextLogo from '@/assets/SummonTextLogo'
import ArbitrumLogo from '@/assets/ArbitrumLogo'
import ConduitLogo from '@/assets/ConduitLogo'
import MarketWarsLogo from '@/assets/MarketWarsLogo'

interface LandingPageProps { }

const LandingPage: React.FC<LandingPageProps> = () => {
  const NAVBAR_ITEMS = [
    { name: 'Home', link: '/' },
    { name: 'Faucet', link: 'faucet' },
    { name: 'Bridge', link: 'bridge' },
    { name: 'Community', link: 'https://discord.com/invite/g7dao' },
    { name: 'Docs', link: 'https://app.gitbook.com/sites/site_Fj9xC/bWmdEUXVjGpgIbH3H5XT/introducing-the-g7-network' }
  ]
  const navigate = useNavigate()

  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0)
  const totalSections = 4
  let scrollThreshold = 0;


  const handleScroll = (event: WheelEvent) => {
    const deltaY = event.deltaY
    scrollThreshold += deltaY
    if ((currentSectionIndex === 0 && scrollThreshold < 0) || (currentSectionIndex === totalSections - 1 && scrollThreshold > 0)) {
      scrollThreshold = 0
      return
    }

    if (scrollThreshold > 700 && currentSectionIndex < totalSections - 1) {
      scrollThreshold = 0
      setCurrentSectionIndex((prevIndex) => prevIndex + 1)
    }

    else if (scrollThreshold < -700 && currentSectionIndex > 0) {
      scrollThreshold = 0
      setCurrentSectionIndex((prevIndex) => prevIndex - 1)
    }
  }

  useEffect(() => {
    window.addEventListener('wheel', handleScroll)

    return () => {
      window.removeEventListener('wheel', handleScroll)
    }
  }, [currentSectionIndex])

  const startBuilding = () => {
    navigate('/bridge')
  }

  const navigateLink = (item: any) => {
    item.name !== 'Docs' && item.name !== 'Community' ? navigate(`/${item.link}`) : window.open(item.link, '_blank')
  }

  return (
    <>
      <div className={styles.layout}>
        {/* NAVBAR */}
        <div className={styles.navbarContainer}>
          <div className={styles.navbar}>
            <div className={styles.logoWrapper}>
              <IconGame7Logo />
              <IconGame7 />
            </div>
            <div className={styles.navbarItemsContainer}>
              <div className={styles.navbarItems}>
                {NAVBAR_ITEMS.map((item) => (
                  <div className={item.name === 'Home' ? styles.navbarItemHome : styles.navbarItem} onClick={() => navigateLink(item)}>{item.name}</div>
                ))}
                <div className={styles.navbarCTA} onClick={startBuilding}>Start building</div>
              </div>
            </div>
          </div>
        </div>
        {/* MAIN LAYOUT */}
        <div className={styles.mainLayout}>
          {/* Main */}
          {currentSectionIndex === 0 && (
            <div className={styles.contentContainer}>
              <div className={styles.pill}>DEVHUB</div>
              <div className={styles.titleContainer}>
                <div className={styles.titleText}>COME BUILD YOUR GAME</div>
                <div className={styles.subtitleText}>Be a part of the future of gaming</div>
              </div>
              <div className={styles.ctaContainer}>
                <div className={styles.learnMoreCTA}>Learn more</div>
                <div className={styles.startBuildingCTA} onClick={startBuilding}>Start building</div>
              </div>
            </div>)}

          {/* G7 Benefits */}
          {currentSectionIndex === 1 && (
            <div className={styles.contentContainer}>
              <div className={styles.sectionTitle}> Get all benefits of the G7 Nation</div>
              <div className={styles.cards}>
                <div className={styles.card}>
                  <div className={styles.cardTitle}>Build for Gamers</div>
                  <div className={`${styles.cardImage} ${styles.cardImageGamers}`} />
                  <div className={styles.cardDescription}>
                    Bootstrap your game with access to 250k+ citizens and counting
                  </div>
                </div>
                <div className={styles.card}>
                  <div className={styles.cardTitle}>Fast and efficient</div>
                  <div className={`${styles.cardImage} ${styles.cardImageLightningQuick}`} />
                  <div className={styles.cardDescription}>Lighting-quick transactions and low cost fees</div>
                </div>
                <div className={styles.card}>
                  <div className={styles.cardTitle}>Special economic zone</div>
                  <div className={`${styles.cardImage} ${styles.cardImageSpecialEcon}`} />
                  <div className={styles.cardDescription}>Gain free access to powerful tools as they are released</div>
                </div>
              </div>
              <div className={styles.startBuildingCTA} onClick={startBuilding}>Start building</div>
            </div>
          )}


          {/* Nation Allies */}
          {currentSectionIndex === 2 && (
            <div className={styles.contentContainer}>
              <div className={styles.sectionTitle}> G7 Nation allies </div>
              <div className={styles.sponsorCards}>
                <div className={styles.sponsorCard}>
                  <div className={styles.sponsorCardImage}>
                    <HyperPlayLogo />
                  </div>
                </div>
                <div className={styles.sponsorCard}>
                  <div className={styles.sponsorCardImage}>
                    <div className={styles.summonLogoContainer}>
                      <SummonLogo />
                      <SummonTextLogo />
                    </div>
                  </div>
                </div>
                <div className={styles.sponsorCard}>
                  <div className={styles.sponsorCardImage}>
                    <ArbitrumLogo />
                  </div>
                </div>
                <div className={styles.sponsorCard}>
                  <div className={styles.sponsorCardImage}>
                    <ConduitLogo />
                  </div>
                </div>
                <MarketWarsLogo />
              </div>
              <div className={styles.startBuildingCTA} onClick={startBuilding}>Start building</div>
            </div>
          )}

          {/* Network Essential Cards */}
          {currentSectionIndex === 3 && (
            <div className={styles.contentContainer}>
              <div className={styles.sectionTitle}>Start building with the network essentials</div>
              <div className={styles.networkEssentialCards}>
                <div className={styles.networkEssentialCard} onClick={() => navigate('/faucet')}>
                  <div className={`${styles.networkEssentialCardImage} ${styles.networkEssentialFaucet}`} />
                  <div className={styles.networkEssentialCardText}>
                    <div className={styles.networkEssentialCardTitle}>Faucet</div>
                    <div className={styles.networkEssentialCardDescription}>
                      Get testnet tokens to start building on G7 testnet
                    </div>
                  </div>
                </div>
                <div className={styles.networkEssentialCard} onClick={() => navigate('/bridge')}>
                  <div className={`${styles.networkEssentialCardImage} ${styles.networkEssentialBridge}`} />
                  <div className={styles.networkEssentialCardText}>
                    <div className={styles.networkEssentialCardTitle}>Bridge</div>
                    <div className={styles.networkEssentialCardDescription}>
                      Bridge tokens between Ethereum, Arbitrum and the G7 network
                    </div>
                  </div>
                </div>
                <div className={styles.networkEssentialCard} onClick={() => window.open('https://discord.com/invite/g7dao', '_blank')}>
                  <div className={`${styles.networkEssentialCardImage} ${styles.networkEssentialExplorer}`} />
                  <div className={styles.networkEssentialCardText}>
                    <div className={styles.networkEssentialCardTitle}>Explorer</div>
                    <div className={styles.networkEssentialCardDescription}>
                      G7 Network block explorer powered by Blockscout. Track and interact directly with your smart
                      contracts
                    </div>
                  </div>
                </div>
                <div className={styles.networkEssentialCard} onClick={() => window.open('https://app.gitbook.com/sites/site_Fj9xC/bWmdEUXVjGpgIbH3H5XT/introducing-the-g7-network', '_blank')}>
                  <div className={`${styles.networkEssentialCardImage} ${styles.networkEssentialDocs}`} />
                  <div className={styles.networkEssentialCardText}>
                    <div className={styles.networkEssentialCardTitle}>Docs</div>
                    <div className={styles.networkEssentialCardDescription}>
                      Get more information about building in the G7 nation
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.startBuildingCTA} onClick={startBuilding}>Start building</div>
            </div>
          )}
          {/* <div className={styles.scrollbarContainer}>
            <IconScrollBar className={styles.scrollBar} />
            <IconScrollBar className={styles.scrollBar} />
            <IconScrollBar className={styles.scrollBar} />
            <IconScrollBar className={styles.scrollBar} />
          </div> */}
        </div>
      </div>
    </>
  )
}

export default LandingPage