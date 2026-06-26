import AnimalWaitCatalog from '@/components/AnimalWaitCatalog'
import CityProgram from '@/components/CityProgram'
import TrustValues from '@/components/TrustValues'
import JoinMission from '@/components/JoinMission'
import HelpUs from '@/components/HelpUs'
import HomeScreenCarousel from '@/components/HomeScreenCarousel'
import { getPublicAnimals } from '@/lib/animals'
import NeedService from '@/components/need-service'

export default async function HomePage() {
  const [{ animals }] = await Promise.all([getPublicAnimals({ from: 0, to: 10000 }, 6)])

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f6f7f4_0%,#fbfaf7_38%,#f7faf6_68%,#fffaf6_100%)]">
      <HomeScreenCarousel />
      <NeedService />
      <CityProgram />
      <AnimalWaitCatalog animals={animals} />
      <TrustValues />
      <JoinMission />
      <HelpUs />
    </main>
  )
}
